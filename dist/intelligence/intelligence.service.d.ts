import { Repository } from 'typeorm';
import { OrderItemEntity } from '../orders/entities/order-item.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { QueryDemandForecastDto } from './dto/query-demand-forecast.dto';
import { QueryProductRecommendationsDto } from './dto/query-product-recommendations.dto';
import { QueryReorderSuggestionsDto } from './dto/query-reorder-suggestions.dto';
type MatrixFactorizationModel = {
    modelType: 'matrix_factorization_sgd';
    status: 'trained';
    trainedAt: string;
    factors: number;
    epochs: number;
    trainInteractions: number;
    users: string[];
    products: string[];
    userFactors: number[][];
    itemFactors: number[][];
    itemBias: number[];
    globalMean: number;
    evaluation: {
        precisionAtK: number;
        holdoutUsers: number;
    };
};
type RidgeRegressionModel = {
    modelType: 'ridge_regression_time_series';
    status: 'trained';
    trainedAt: string;
    featureNames: string[];
    weights: number[];
    means: number[];
    scales: number[];
    evaluation: {
        trainRows: number;
        testRows: number;
        mae: number;
        rmse: number;
        mape: number | null;
    };
};
export declare class IntelligenceService {
    private readonly ordersRepository;
    private readonly orderItemsRepository;
    private readonly productsRepository;
    constructor(ordersRepository: Repository<OrderEntity>, orderItemsRepository: Repository<OrderItemEntity>, productsRepository: Repository<ProductEntity>);
    getProductRecommendations(query: QueryProductRecommendationsDto): Promise<{
        mode: string;
        model: MatrixFactorizationModel;
        sourceProduct: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
        };
        historyDays: number;
        items: {
            primaryImageUrl: null;
            score: number;
            confidence: number;
            reason: string;
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
        }[];
    } | {
        mode: string;
        model: {
            modelType: string;
            status: string;
            reason: string;
        };
        sourceProduct: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
        };
        historyDays: number;
        items: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
            score: number;
            confidence: number;
            reason: string;
        }[];
    } | {
        mode: string;
        model: {
            modelType: string;
            status: string;
            reason: string;
        };
        sourceProduct: null;
        historyDays: number;
        items: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
            score: number;
            confidence: number;
            reason: string;
        }[];
    }>;
    getDemandForecast(query: QueryDemandForecastDto): Promise<{
        product: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
        };
        model: RidgeRegressionModel | {
            modelType: string;
            status: string;
            reason: string;
        };
        historyDays: number;
        horizonDays: number;
        observedDemand: {
            date: string;
            quantity: number;
        }[];
        stats: {
            avg7: number;
            avg30: number;
            avgAll: number;
            weightedAverageDailyDemand: number;
            stdDev30: number;
            totalDemand: number;
            activeSalesDays: number;
        };
        forecast: {
            date: string;
            forecastQuantity: number;
            model: "ridge_regression_time_series";
        }[] | {
            date: string;
            forecastQuantity: number;
            weekdayFactor: number;
        }[];
        summary: {
            currentStock: number;
            reservedStock: number;
            totalForecastDemand: number;
            projectedStockAfterHorizon: number;
            confidence: string;
        };
    }>;
    getReorderSuggestions(query: QueryReorderSuggestionsDto): Promise<{
        historyDays: number;
        leadTimeDays: number;
        coverageDays: number;
        items: {
            product: {
                productId: string;
                productName: string;
                effectivePrice: string;
                basePrice: string;
                unit: string | null;
                quantityAvailable: number;
                quantityReserved: number;
                avgCost: string;
            };
            avgDailyDemand: number;
            demandStdDev30: number;
            safetyStock: number;
            reorderPoint: number;
            targetStock: number;
            suggestedOrderQty: number;
            daysUntilStockout: number | null;
            daysUntilStockoutValue: number;
            shouldReorder: boolean;
            urgency: "none" | "high" | "medium" | "low";
            model: {
                modelType: "ridge_regression_time_series";
                mae: number;
                rmse: number;
                reason?: undefined;
            } | {
                modelType: string;
                reason: string;
                mae?: undefined;
                rmse?: undefined;
            };
            reason: string;
        }[];
        summary: {
            totalProductsAnalyzed: number;
            totalSuggestions: number;
            highUrgency: number;
            mediumUrgency: number;
        };
    }>;
    private countOrdersContainingProduct;
    private getCoPurchaseRecommendations;
    private getPopularProductRecommendations;
    private getRecommendationInteractions;
    private trainMatrixFactorization;
    private recommendByMatrixFactorization;
    private evaluateMatrixFactorization;
    private getDailyDemandSeries;
    private getAllProductDailyDemand;
    private groupDemandByProduct;
    private buildReorderSuggestion;
    private trainDemandRegressionModel;
    private buildRegressionForecast;
    private buildTimeSeriesTrainingRows;
    private buildTimeSeriesFeatures;
    private normalizeTrainingRows;
    private fitRidgeRegression;
    private buildForecast;
    private calculateDemandStats;
    private calculateWeeklySeasonality;
    private getForecastConfidence;
    private getReorderUrgency;
    private buildReorderReason;
    private mapProduct;
    private emptyDemandSeries;
    private dot;
    private cosineSimilarity;
    private seededRandom;
    private shuffleDeterministic;
    private mae;
    private rmse;
    private mape;
    private average;
    private stdDev;
    private dateRange;
    private daysAgo;
    private addDays;
    private startOfDay;
    private endOfDay;
    private toDateKey;
}
export {};
