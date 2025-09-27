import Ajv, { JSONSchemaType, Schema } from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as path from 'path';
import { CampaignRecommendation } from '../types/campaign';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  errorDetails?: any[];
}

export interface ValidationStats {
  totalValidations: number;
  validCount: number;
  invalidCount: number;
  mostCommonErrors: Record<string, number>;
  lastValidationTime: string;
}

export class SchemaValidatorService {
  private ajv: Ajv;
  private campaignSchema: any;
  private validationStats: ValidationStats;

  constructor() {
    // Initialize AJV with formats (for date-time validation)
    this.ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      strict: false // Allow additional properties for metadata flexibility
    });
    addFormats(this.ajv);

    // Initialize validation statistics
    this.validationStats = {
      totalValidations: 0,
      validCount: 0,
      invalidCount: 0,
      mostCommonErrors: {},
      lastValidationTime: new Date().toISOString()
    };

    // Load and compile the campaign recommendation schema
    this.loadCampaignSchema();
  }

  /**
   * Load and compile the JSON schema for campaign recommendations
   */
  private loadCampaignSchema(): void {
    try {
      const schemaPath = path.join(__dirname, '../schemas/campaign-recommendation.schema.json');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      this.campaignSchema = JSON.parse(schemaContent);
      
      // Compile the schema for better performance
      this.ajv.compile(this.campaignSchema);
      
      console.log('Campaign recommendation schema loaded and compiled successfully');
    } catch (error) {
      console.error('Failed to load campaign recommendation schema:', error);
      throw new Error('Schema validation service initialization failed');
    }
  }

  /**
   * Validate a campaign recommendation against the JSON schema
   */
  public validateCampaignRecommendation(recommendation: any): ValidationResult {
    this.validationStats.totalValidations++;
    this.validationStats.lastValidationTime = new Date().toISOString();

    const validate = this.ajv.compile(this.campaignSchema);
    const isValid = validate(recommendation);

    if (isValid) {
      this.validationStats.validCount++;
      return {
        valid: true
      };
    } else {
      this.validationStats.invalidCount++;
      
      // Process validation errors
      const errors = validate.errors || [];
      const errorMessages = errors.map(error => {
        const path = error.instancePath || 'root';
        const message = error.message || 'Unknown error';
        const errorKey = `${path}: ${message}`;
        
        // Track common errors
        this.validationStats.mostCommonErrors[errorKey] = 
          (this.validationStats.mostCommonErrors[errorKey] || 0) + 1;
        
        return `${path}: ${message}`;
      });

      return {
        valid: false,
        errors: errorMessages,
        errorDetails: errors
      };
    }
  }

  /**
   * Validate and sanitize a campaign recommendation
   * Attempts to fix common validation issues automatically
   */
  public validateAndSanitize(recommendation: any): { 
    valid: boolean; 
    sanitized?: CampaignRecommendation; 
    errors?: string[];
    changes?: string[];
  } {
    const changes: string[] = [];
    let sanitized = { ...recommendation };

    // Auto-fix common issues
    try {
      // Ensure required top-level fields exist
      if (!sanitized.id || typeof sanitized.id !== 'string') {
        sanitized.id = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        changes.push('Generated missing id');
      }

      if (!sanitized.timestamp || !this.isValidISO8601(sanitized.timestamp)) {
        sanitized.timestamp = new Date().toISOString();
        changes.push('Fixed invalid timestamp');
      }

      // Fix audience structure
      if (!sanitized.audience || typeof sanitized.audience !== 'object') {
        sanitized.audience = {
          segment_id: 'auto-generated',
          name: 'Auto-Generated Segment',
          filters: {}
        };
        changes.push('Fixed missing audience structure');
      } else {
        if (!sanitized.audience.segment_id) {
          sanitized.audience.segment_id = 'auto-generated';
          changes.push('Added missing audience.segment_id');
        }
        if (!sanitized.audience.name) {
          sanitized.audience.name = 'Auto-Generated Segment';
          changes.push('Added missing audience.name');
        }
        if (!sanitized.audience.filters || typeof sanitized.audience.filters !== 'object') {
          sanitized.audience.filters = {};
          changes.push('Added missing audience.filters');
        }
      }

      // Fix reasoning structure
      if (!sanitized.reasoning || typeof sanitized.reasoning !== 'object') {
        sanitized.reasoning = {
          signals: ['Auto-generated reasoning'],
          score: 0.5,
          explain: 'Auto-generated campaign recommendation'
        };
        changes.push('Fixed missing reasoning structure');
      } else {
        if (!Array.isArray(sanitized.reasoning.signals) || sanitized.reasoning.signals.length === 0) {
          sanitized.reasoning.signals = ['Auto-generated reasoning'];
          changes.push('Fixed missing reasoning.signals');
        }
        if (typeof sanitized.reasoning.score !== 'number' || sanitized.reasoning.score < 0 || sanitized.reasoning.score > 1) {
          sanitized.reasoning.score = Math.min(Math.max(sanitized.reasoning.score || 0.5, 0), 1);
          changes.push('Fixed invalid reasoning.score');
        }
        if (!sanitized.reasoning.explain || typeof sanitized.reasoning.explain !== 'string') {
          sanitized.reasoning.explain = 'Auto-generated campaign recommendation';
          changes.push('Added missing reasoning.explain');
        }
      }

      // Fix channel_plan structure
      if (!Array.isArray(sanitized.channel_plan) || sanitized.channel_plan.length === 0) {
        sanitized.channel_plan = [{
          channel: 'Email' as const,
          send_at: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
          priority: 1,
          payload: {
            subject: 'Campaign Recommendation',
            body: 'Auto-generated campaign message',
            cta: { action: 'view', url: '#' },
            metadata: {}
          },
          delivery_instructions: {
            retry_policy: 'exponential_backoff',
            timeout_sec: 30
          }
        }];
        changes.push('Fixed missing channel_plan');
      } else {
        // Validate each channel plan item
        sanitized.channel_plan = sanitized.channel_plan.map((plan: any, index: number) => {
          const fixedPlan = { ...plan };
          
          if (!['Email', 'Push', 'WhatsApp', 'Ads', 'SMS', 'Messenger', 'Voice'].includes(plan.channel)) {
            fixedPlan.channel = 'Email';
            changes.push(`Fixed invalid channel in plan ${index + 1}`);
          }
          
          if (!plan.send_at || !this.isValidISO8601(plan.send_at)) {
            fixedPlan.send_at = new Date(Date.now() + 300000 + (index * 60000)).toISOString();
            changes.push(`Fixed invalid send_at in plan ${index + 1}`);
          }
          
          if (!plan.priority || typeof plan.priority !== 'number' || plan.priority < 1) {
            fixedPlan.priority = index + 1;
            changes.push(`Fixed invalid priority in plan ${index + 1}`);
          }
          
          if (!plan.payload || typeof plan.payload !== 'object') {
            fixedPlan.payload = {
              body: 'Auto-generated campaign message',
              cta: { action: 'view', url: '#' },
              metadata: {}
            };
            changes.push(`Fixed missing payload in plan ${index + 1}`);
          } else {
            if (!plan.payload.body) {
              fixedPlan.payload.body = 'Auto-generated campaign message';
              changes.push(`Added missing body in plan ${index + 1}`);
            }
            if (!plan.payload.cta || typeof plan.payload.cta !== 'object') {
              fixedPlan.payload.cta = { action: 'view', url: '#' };
              changes.push(`Added missing cta in plan ${index + 1}`);
            }
            if (!plan.payload.metadata || typeof plan.payload.metadata !== 'object') {
              fixedPlan.payload.metadata = {};
              changes.push(`Added missing metadata in plan ${index + 1}`);
            }
          }
          
          if (!plan.delivery_instructions || typeof plan.delivery_instructions !== 'object') {
            fixedPlan.delivery_instructions = {
              retry_policy: 'exponential_backoff',
              timeout_sec: 30
            };
            changes.push(`Fixed missing delivery_instructions in plan ${index + 1}`);
          } else {
            if (!plan.delivery_instructions.retry_policy) {
              fixedPlan.delivery_instructions.retry_policy = 'exponential_backoff';
              changes.push(`Added missing retry_policy in plan ${index + 1}`);
            }
            if (!plan.delivery_instructions.timeout_sec || typeof plan.delivery_instructions.timeout_sec !== 'number') {
              fixedPlan.delivery_instructions.timeout_sec = 30;
              changes.push(`Fixed invalid timeout_sec in plan ${index + 1}`);
            }
          }
          
          return fixedPlan;
        });
      }

      // Fix campaign_meta structure
      if (!sanitized.campaign_meta || typeof sanitized.campaign_meta !== 'object') {
        sanitized.campaign_meta = {
          source_snapshot: {},
          engine_version: 'v1.0-decision-engine',
          confidence: 0.5
        };
        changes.push('Fixed missing campaign_meta structure');
      } else {
        if (!sanitized.campaign_meta.source_snapshot || typeof sanitized.campaign_meta.source_snapshot !== 'object') {
          sanitized.campaign_meta.source_snapshot = {};
          changes.push('Added missing source_snapshot');
        }
        if (!sanitized.campaign_meta.engine_version) {
          sanitized.campaign_meta.engine_version = 'v1.0-decision-engine';
          changes.push('Added missing engine_version');
        }
        if (typeof sanitized.campaign_meta.confidence !== 'number' || sanitized.campaign_meta.confidence < 0 || sanitized.campaign_meta.confidence > 1) {
          sanitized.campaign_meta.confidence = Math.min(Math.max(sanitized.campaign_meta.confidence || 0.5, 0), 1);
          changes.push('Fixed invalid confidence score');
        }
      }

    } catch (error) {
      console.error('Error during sanitization:', error);
      return {
        valid: false,
        errors: [`Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }

    // Validate the sanitized recommendation
    const validationResult = this.validateCampaignRecommendation(sanitized);

    return {
      valid: validationResult.valid,
      sanitized: validationResult.valid ? sanitized as CampaignRecommendation : undefined,
      errors: validationResult.errors,
      changes: changes.length > 0 ? changes : undefined
    };
  }

  /**
   * Get validation statistics
   */
  public getValidationStats(): ValidationStats {
    return { ...this.validationStats };
  }

  /**
   * Reset validation statistics
   */
  public resetValidationStats(): void {
    this.validationStats = {
      totalValidations: 0,
      validCount: 0,
      invalidCount: 0,
      mostCommonErrors: {},
      lastValidationTime: new Date().toISOString()
    };
  }

  /**
   * Generate a sample valid campaign recommendation for testing
   */
  public generateSampleValidRecommendation(): CampaignRecommendation {
    return {
      id: `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      audience: {
        segment_id: 'high-intent-customers',
        name: 'High Intent Customers',
        filters: {
          intent_score: '>= 0.8',
          recent_activity: '<= 1h'
        }
      },
      reasoning: {
        signals: [
          'Recent cart abandonment detected',
          'High product engagement activity',
          'Extended browsing session indicates interest'
        ],
        score: 0.85,
        explain: 'Customer demonstrates high urgency with 3 positive signals indicating strong conversion potential.'
      },
      channel_plan: [
        {
          channel: 'Email',
          send_at: new Date(Date.now() + 300000).toISOString(),
          priority: 1,
          payload: {
            subject: 'Complete your purchase - Limited time offer!',
            title: 'Don\'t miss out!',
            body: 'You left some great items in your cart. Complete your purchase now and get 10% off!',
            cta: {
              text: 'Complete Purchase',
              url: 'https://example.com/checkout',
              action: 'checkout'
            },
            metadata: {
              campaign_type: 'cart_abandonment',
              discount_code: 'SAVE10'
            }
          },
          delivery_instructions: {
            retry_policy: 'exponential_backoff',
            timeout_sec: 30
          }
        }
      ],
      campaign_meta: {
        source_snapshot: {
          website: {
            cart_abandonment: {
              cart_value: 150,
              items_count: 3
            }
          }
        },
        engine_version: 'v1.0-decision-engine',
        confidence: 0.87
      }
    };
  }

  /**
   * Helper method to validate ISO8601 date strings
   */
  private isValidISO8601(dateString: string): boolean {
    try {
      const date = new Date(dateString);
      return date.toISOString() === dateString;
    } catch {
      return false;
    }
  }

  /**
   * Validate multiple recommendations in batch
   */
  public validateBatch(recommendations: any[]): {
    valid: number;
    invalid: number;
    results: Array<{ index: number; valid: boolean; errors?: string[] }>;
  } {
    const results: Array<{ index: number; valid: boolean; errors?: string[] }> = [];
    let validCount = 0;
    let invalidCount = 0;

    recommendations.forEach((recommendation, index) => {
      const validationResult = this.validateCampaignRecommendation(recommendation);
      
      results.push({
        index,
        valid: validationResult.valid,
        errors: validationResult.errors
      });

      if (validationResult.valid) {
        validCount++;
      } else {
        invalidCount++;
      }
    });

    return {
      valid: validCount,
      invalid: invalidCount,
      results
    };
  }
}