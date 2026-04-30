import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ColorEntity } from '../products/entities/color.entity';
import { ProductImageEntity } from '../products/entities/product-image.entity';
import { ProductVariantEntity } from '../products/entities/product-variant.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { SizeEntity } from '../products/entities/size.entity';
import { VariantImageEntity } from '../products/entities/variant-image.entity';
import { CreateVirtualTryOnDto } from './dto/create-virtual-try-on.dto';

type UploadedImageFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
};

type GarmentContext = {
  product: ProductEntity;
  variant: ProductVariantEntity | null;
  garmentImageUrl: string;
  color: ColorEntity | null;
  size: SizeEntity | null;
  stockQuantity: number;
  canPurchase: boolean;
  warnings: string[];
};

type ProviderResult = {
  resultImageUrl: string | null;
  resultImageDataUrl: string | null;
  confidence: number | null;
  processingMs: number | null;
  modelVersion: string | null;
  provider: string;
  warnings: string[];
};

const MAX_PERSON_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Injectable()
export class VirtualTryOnService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantsRepository: Repository<ProductVariantEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImagesRepository: Repository<ProductImageEntity>,
    @InjectRepository(VariantImageEntity)
    private readonly variantImagesRepository: Repository<VariantImageEntity>,
    @InjectRepository(ColorEntity)
    private readonly colorsRepository: Repository<ColorEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizesRepository: Repository<SizeEntity>,
    private readonly configService: ConfigService,
  ) {}

  async getServiceStatus() {
    const baseUrl = this.getServiceBaseUrl();
    const headers = this.getServiceHeaders();

    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.getServiceTimeoutMs()),
      });
      const payload = await this.readJsonSafely(response);

      return {
        configured: Boolean(this.configService.get<string>('VIRTUAL_TRY_ON_SERVICE_URL')),
        reachable: response.ok,
        baseUrl,
        statusCode: response.status,
        payload,
      };
    } catch (error) {
      return {
        configured: Boolean(this.configService.get<string>('VIRTUAL_TRY_ON_SERVICE_URL')),
        reachable: false,
        baseUrl,
        statusCode: null,
        payload: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createSession(dto: CreateVirtualTryOnDto, personImage?: UploadedImageFile) {
    this.validatePersonImage(personImage);

    const garment = await this.resolveGarmentContext(dto);
    const providerResult = await this.requestTryOn(dto, personImage!, garment);
    const resultImage = providerResult.resultImageUrl ?? providerResult.resultImageDataUrl;

    if (!resultImage) {
      throw new InternalServerErrorException(
        'Virtual try-on service response is missing a result image',
      );
    }

    return {
      requestId: randomUUID(),
      status: 'completed',
      provider: providerResult.provider,
      resultImageUrl: providerResult.resultImageUrl,
      resultImageDataUrl: providerResult.resultImageDataUrl,
      confidence: providerResult.confidence,
      processingMs: providerResult.processingMs,
      model: {
        version: providerResult.modelVersion,
        task: 'virtual_try_on',
      },
      garment: {
        productId: garment.product.productId,
        productName: garment.product.productName,
        variantId: garment.variant?.variantId ?? null,
        sku: garment.variant?.sku ?? null,
        imageUrl: garment.garmentImageUrl,
        color: garment.color
          ? {
              colorId: garment.color.colorId,
              colorName: garment.color.colorName,
              colorCode: garment.color.colorCode,
            }
          : null,
        size: garment.size
          ? {
              sizeId: garment.size.sizeId,
              sizeName: garment.size.sizeName,
              sizeCode: garment.size.sizeCode,
            }
          : null,
        stockQuantity: garment.stockQuantity,
        canPurchase: garment.canPurchase,
      },
      warnings: [...garment.warnings, ...providerResult.warnings],
      advisory: {
        headline: garment.canPurchase
          ? 'Ket qua thu do da san sang'
          : 'Ket qua thu do chi de tham khao',
        disclaimer:
          'Mau sac, do vua va ti le co the sai lech do anh chup, anh san pham va mo hinh AI.',
      },
    };
  }

  private validatePersonImage(file?: UploadedImageFile) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Person image is required');
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Only JPG, PNG and WEBP person images are supported',
      );
    }

    if (file.size > MAX_PERSON_IMAGE_BYTES) {
      throw new BadRequestException('Person image size must not exceed 8MB');
    }

    if (!this.hasValidImageSignature(file.buffer, file.mimetype)) {
      throw new BadRequestException(
        'Person image content does not match the declared file type',
      );
    }
  }

  private async resolveGarmentContext(dto: CreateVirtualTryOnDto): Promise<GarmentContext> {
    const product = await this.productsRepository.findOneBy({
      productId: dto.productId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isShow) {
      throw new BadRequestException('Product is not available for virtual try-on');
    }

    const variants = await this.productVariantsRepository.find({
      where: { productId: product.productId },
      order: { createdAt: 'ASC' },
    });
    const activeVariants = variants.filter((variant) => variant.isActive);
    const variant = dto.variantId
      ? await this.resolveRequestedVariant(product.productId, dto.variantId)
      : this.pickDefaultVariant(activeVariants);

    const [variantImage, productImage, color, size] = await Promise.all([
      variant
        ? this.variantImagesRepository.findOne({
            where: { variantId: variant.variantId },
            order: { sortOrder: 'ASC', createdAt: 'ASC' },
          })
        : Promise.resolve(null),
      this.findPrimaryProductImage(product.productId),
      variant?.colorId
        ? this.colorsRepository.findOneBy({ colorId: variant.colorId })
        : Promise.resolve(null),
      variant?.sizeId
        ? this.sizesRepository.findOneBy({ sizeId: variant.sizeId })
        : Promise.resolve(null),
    ]);

    const warnings: string[] = [];
    const usableVariantImage = this.isUsableGarmentImageUrl(variantImage?.imageUrl)
      ? variantImage
      : null;
    const usableProductImage = this.isUsableGarmentImageUrl(productImage?.imageUrl)
      ? productImage
      : null;

    if (variant && !usableVariantImage && usableProductImage) {
      warnings.push('using_product_image_fallback');
    }

    const garmentImageUrl =
      usableVariantImage?.imageUrl ?? usableProductImage?.imageUrl ?? null;
    if (!garmentImageUrl) {
      throw new BadRequestException(
        'Product needs at least one garment image for virtual try-on',
      );
    }

    this.validateGarmentImageUrl(garmentImageUrl);

    const stockQuantity = variant
      ? variant.stockQuantity
      : activeVariants.length
        ? activeVariants.reduce((sum, item) => sum + item.stockQuantity, 0)
        : product.quantityAvailable;
    const canPurchase = stockQuantity > 0;
    if (!canPurchase) {
      warnings.push('garment_out_of_stock');
    }

    return {
      product,
      variant,
      garmentImageUrl,
      color,
      size,
      stockQuantity,
      canPurchase,
      warnings,
    };
  }

  private async resolveRequestedVariant(productId: string, variantId: string) {
    const variant = await this.productVariantsRepository.findOneBy({
      productId,
      variantId,
    });
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (!variant.isActive) {
      throw new BadRequestException('Product variant is not active');
    }

    return variant;
  }

  private pickDefaultVariant(variants: ProductVariantEntity[]) {
    if (variants.length === 0) {
      return null;
    }

    return variants.find((variant) => variant.stockQuantity > 0) ?? variants[0];
  }

  private async findPrimaryProductImage(productId: string) {
    return (
      (await this.productImagesRepository.findOne({
        where: { productId, isPrimary: true },
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
      })) ??
      (await this.productImagesRepository.findOne({
        where: { productId },
        order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
      }))
    );
  }

  private async requestTryOn(
    dto: CreateVirtualTryOnDto,
    personImage: UploadedImageFile,
    garment: GarmentContext,
  ): Promise<ProviderResult> {
    if (this.getReplicateToken()) {
      return this.requestReplicateTryOn(dto, personImage, garment);
    }

    const formData = new FormData();
    const binary = Uint8Array.from(personImage.buffer);
    const blob = new Blob([binary.buffer], { type: personImage.mimetype });
    formData.append(
      'person_image',
      blob,
      personImage.originalname || 'person-image.jpg',
    );
    formData.append('garment_image_url', garment.garmentImageUrl);
    formData.append('product_id', garment.product.productId);
    formData.append('product_name', garment.product.productName);
    formData.append('variant_id', garment.variant?.variantId ?? '');
    formData.append('pose_preference', dto.posePreference ?? 'auto');
    formData.append(
      'metadata',
      JSON.stringify({
        gender: garment.product.gender,
        material: garment.product.material,
        fitType: garment.product.fitType,
        style: garment.product.style,
        color: garment.color?.colorName ?? null,
        size: garment.size?.sizeCode ?? garment.size?.sizeName ?? null,
        canPurchase: garment.canPurchase,
        note: dto.note?.trim() || null,
      }),
    );

    let response: Response;
    try {
      response = await fetch(`${this.getServiceBaseUrl()}/try-on`, {
        method: 'POST',
        headers: this.getServiceHeaders(),
        body: formData,
        signal: AbortSignal.timeout(this.getServiceTimeoutMs()),
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        `Virtual try-on AI service is unavailable: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }

    const payload = await this.readJsonSafely(response);
    if (!response.ok) {
      const message = this.readString(payload?.message) ??
        this.readString(payload?.error) ??
        `Virtual try-on request failed with ${response.status}`;
      throw new ServiceUnavailableException(message);
    }

    return this.normalizeProviderPayload(payload);
  }

  private async requestReplicateTryOn(
    dto: CreateVirtualTryOnDto,
    personImage: UploadedImageFile,
    garment: GarmentContext,
  ): Promise<ProviderResult> {
    const startedAt = Date.now();
    const token = this.getReplicateToken();
    if (!token) {
      throw new ServiceUnavailableException(
        'REPLICATE_API_TOKEN is required for real virtual try-on generation',
      );
    }

    const version = this.getReplicateModelVersion();
    const timeoutMs = this.getServiceTimeoutMs();
    const body = {
      version,
      input: {
        human_img: this.toDataUrl(personImage),
        garm_img: garment.garmentImageUrl,
        garment_des: this.buildGarmentDescription(dto, garment),
        category: this.inferReplicateCategory(garment),
        crop: true,
        force_dc: this.inferReplicateCategory(garment) === 'dresses',
        steps: this.getReplicateSteps(),
        seed: this.getReplicateSeed(),
      },
    };

    let response: Response;
    try {
      response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Cancel-After': `${Math.max(30, Math.ceil(timeoutMs / 1000))}s`,
          'Content-Type': 'application/json',
          Prefer: 'wait=60',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        `Replicate virtual try-on service is unavailable: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }

    let prediction = await this.readJsonSafely(response);
    if (!response.ok) {
      throw new ServiceUnavailableException(
        this.extractProviderError(prediction) ??
          `Replicate virtual try-on request failed with ${response.status}`,
      );
    }

    prediction = await this.waitForReplicatePrediction(prediction, token, timeoutMs);
    const status = this.readString(prediction.status);
    if (status && ['failed', 'canceled', 'cancelled'].includes(status)) {
      throw new ServiceUnavailableException(
        this.extractProviderError(prediction) ??
          `Replicate virtual try-on prediction ${status}`,
      );
    }

    const output = (prediction as Record<string, unknown>).output;
    const resultImageUrl = Array.isArray(output)
      ? this.readString(output[0])
      : this.readString(output);
    if (!resultImageUrl) {
      throw new InternalServerErrorException(
        'Replicate virtual try-on response is missing output image URL',
      );
    }

    const metrics =
      prediction.metrics && typeof prediction.metrics === 'object'
        ? (prediction.metrics as Record<string, unknown>)
        : {};

    return {
      resultImageUrl,
      resultImageDataUrl: null,
      confidence: null,
      processingMs:
        this.readNumber(metrics.predict_time) !== null
          ? Math.round(this.readNumber(metrics.predict_time)! * 1000)
          : Date.now() - startedAt,
      modelVersion: version,
      provider: 'replicate:cuuupid/idm-vton',
      warnings: garment.garmentImageUrl.includes('example.com')
        ? ['garment_image_may_not_be_reachable']
        : [],
    };
  }

  private async waitForReplicatePrediction(
    prediction: Record<string, unknown>,
    token: string,
    timeoutMs: number,
  ) {
    const deadline = Date.now() + timeoutMs;
    let current = prediction;

    while (Date.now() < deadline) {
      const status = this.readString(current.status);
      if (status && ['succeeded', 'successful', 'failed', 'canceled', 'cancelled'].includes(status)) {
        return current;
      }

      const urls =
        current.urls && typeof current.urls === 'object'
          ? (current.urls as Record<string, unknown>)
          : {};
      const getUrl = this.readString(urls.get);
      if (!getUrl) {
        return current;
      }

      await this.sleep(2000);
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(Math.max(5000, Math.min(15000, deadline - Date.now()))),
      });
      current = await this.readJsonSafely(response);
      if (!response.ok) {
        throw new ServiceUnavailableException(
          this.extractProviderError(current) ??
            `Replicate polling request failed with ${response.status}`,
        );
      }
    }

    throw new ServiceUnavailableException(
      'Replicate virtual try-on prediction timed out before completion',
    );
  }

  private normalizeProviderPayload(payload: unknown): ProviderResult {
    if (!payload || typeof payload !== 'object') {
      throw new InternalServerErrorException(
        'Virtual try-on service returned an invalid response payload',
      );
    }

    const source = payload as Record<string, unknown>;
    const nested =
      source.data && typeof source.data === 'object'
        ? (source.data as Record<string, unknown>)
        : source;
    const resultImageUrl =
      this.readString(nested.result_image_url) ??
      this.readString(nested.output_image_url) ??
      this.readString(nested.image_url) ??
      this.readString(nested.resultImageUrl);
    const base64 =
      this.readString(nested.result_image_base64) ??
      this.readString(nested.output_image_base64) ??
      this.readString(nested.image_base64);
    const mimeType = this.readString(nested.mime_type) ?? 'image/png';
    const resultImageDataUrl = base64
      ? base64.startsWith('data:')
        ? base64
        : `data:${mimeType};base64,${base64}`
      : null;
    const warnings = Array.isArray(nested.warnings)
      ? nested.warnings.filter(
          (item): item is string => typeof item === 'string' && item.trim().length > 0,
        )
      : [];

    if (!resultImageUrl && !resultImageDataUrl) {
      throw new InternalServerErrorException(
        'Virtual try-on service response is missing result_image_url or result_image_base64',
      );
    }

    return {
      resultImageUrl,
      resultImageDataUrl,
      confidence: this.readNumber(nested.confidence),
      processingMs:
        this.readNumber(nested.processing_ms) ??
        this.readNumber(nested.processingMs),
      modelVersion:
        this.readString(nested.model_version) ??
        this.readString(nested.modelVersion),
      provider:
        this.readString(nested.provider) ??
        this.configService.get<string>('VIRTUAL_TRY_ON_PROVIDER') ??
        'virtual-try-on-service',
      warnings,
    };
  }

  private async readJsonSafely(response: Response) {
    try {
      return (await response.json()) as Record<string, unknown>;
    } catch {
      throw new InternalServerErrorException(
        'Virtual try-on service returned an invalid JSON response',
      );
    }
  }

  private validateGarmentImageUrl(value: string) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new BadRequestException('Product garment image URL is invalid');
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new BadRequestException('Product garment image URL must use HTTP or HTTPS');
    }
  }

  private isUsableGarmentImageUrl(value?: string | null) {
    return Boolean(value && !/\/\/example\.com\//i.test(value));
  }

  private toDataUrl(file: UploadedImageFile) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  private buildGarmentDescription(
    dto: CreateVirtualTryOnDto,
    garment: GarmentContext,
  ) {
    const parts = [
      garment.product.productName,
      garment.color?.colorName,
      garment.size?.sizeCode ?? garment.size?.sizeName,
      garment.product.material,
      garment.product.fitType,
      garment.product.style,
      dto.note?.trim(),
    ];

    return parts.filter((value): value is string => Boolean(value?.trim())).join(', ');
  }

  private inferReplicateCategory(garment: GarmentContext) {
    const text = [
      garment.product.productName,
      garment.product.style,
      garment.product.fitType,
    ]
      .filter(Boolean)
      .join(' ')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (/(dam|dress|vay lien|jumpsuit)/.test(text)) {
      return 'dresses';
    }

    if (/(quan|jean|pants|short|skirt|chan vay|trouser)/.test(text)) {
      return 'lower_body';
    }

    return 'upper_body';
  }

  private extractProviderError(payload: unknown) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const source = payload as Record<string, unknown>;
    const error =
      this.readString(source.error) ??
      this.readString(source.detail) ??
      this.readString(source.message);

    if (error) {
      return error;
    }

    if (source.error && typeof source.error === 'object') {
      return (
        this.readString((source.error as Record<string, unknown>).message) ??
        this.readString((source.error as Record<string, unknown>).detail)
      );
    }

    return null;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private hasValidImageSignature(buffer: Buffer, mimetype: string) {
    if (mimetype === 'image/jpeg') {
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (mimetype === 'image/png') {
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    }

    if (mimetype === 'image/webp') {
      return (
        buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP'
      );
    }

    return false;
  }

  private getServiceBaseUrl() {
    return (
      this.configService
        .get<string>('VIRTUAL_TRY_ON_SERVICE_URL')
        ?.replace(/\/+$/, '') ?? 'http://127.0.0.1:5002'
    );
  }

  private getReplicateToken() {
    return this.configService.get<string>('REPLICATE_API_TOKEN')?.trim() || null;
  }

  private getReplicateModelVersion() {
    return (
      this.configService.get<string>('REPLICATE_IDM_VTON_VERSION')?.trim() ||
      '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985'
    );
  }

  private getReplicateSteps() {
    const value = Number(this.configService.get<string>('REPLICATE_IDM_VTON_STEPS') ?? '30');
    return Number.isFinite(value) ? Math.max(10, Math.min(40, value)) : 30;
  }

  private getReplicateSeed() {
    const configured = Number(this.configService.get<string>('REPLICATE_IDM_VTON_SEED'));
    return Number.isFinite(configured)
      ? configured
      : Math.floor(Math.random() * 1_000_000);
  }

  private getServiceTimeoutMs() {
    return Number(
      this.configService.get<string>('VIRTUAL_TRY_ON_TIMEOUT_MS') ?? '45000',
    );
  }

  private getServiceHeaders() {
    const token = this.configService.get<string>('VIRTUAL_TRY_ON_SERVICE_TOKEN');
    return token ? ({ 'x-api-key': token } as Record<string, string>) : {};
  }

  private readString(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private readNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }
}
