import { SchemaValidatorService } from '../src/services/schema-validator.service';
import { CampaignRecommendation } from '../src/types/campaign';

describe('SchemaValidatorService', () => {
  let schemaValidator: SchemaValidatorService;

  beforeEach(() => {
    schemaValidator = new SchemaValidatorService();
    schemaValidator.resetValidationStats();
  });

  describe('Schema Loading and Initialization', () => {
    test('should initialize successfully', () => {
      expect(schemaValidator).toBeInstanceOf(SchemaValidatorService);
    });

    test('should have initial validation stats', () => {
      const stats = schemaValidator.getValidationStats();
      expect(stats.totalValidations).toBe(0);
      expect(stats.validCount).toBe(0);
      expect(stats.invalidCount).toBe(0);
      expect(stats.mostCommonErrors).toEqual({});
    });
  });

  describe('Valid Campaign Recommendation Validation', () => {
    test('should validate a properly structured campaign recommendation', () => {
      const validRecommendation: CampaignRecommendation = {
        id: 'test_recommendation_123',
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
          signals: ['Recent cart abandonment detected', 'High product engagement'],
          score: 0.85,
          explain: 'Customer shows strong purchase intent based on recent behavior patterns.'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date(Date.now() + 300000).toISOString(),
            priority: 1,
            payload: {
              subject: 'Complete your purchase now!',
              title: 'Don\'t miss out',
              body: 'You have items waiting in your cart. Complete your purchase now and save 15%!',
              cta: {
                text: 'Complete Purchase',
                url: 'https://example.com/checkout',
                action: 'checkout'
              },
              metadata: {
                campaign_type: 'cart_abandonment',
                discount_percent: 15
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

      const result = schemaValidator.validateCampaignRecommendation(validRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
      
      const stats = schemaValidator.getValidationStats();
      expect(stats.totalValidations).toBe(1);
      expect(stats.validCount).toBe(1);
      expect(stats.invalidCount).toBe(0);
    });

    test('should validate sample recommendation from generator', () => {
      const sampleRecommendation = schemaValidator.generateSampleValidRecommendation();
      const result = schemaValidator.validateCampaignRecommendation(sampleRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('Invalid Campaign Recommendation Validation', () => {
    test('should fail validation for missing required fields', () => {
      const invalidRecommendation = {
        id: 'test_invalid_123'
        // Missing other required fields
      };

      const result = schemaValidator.validateCampaignRecommendation(invalidRecommendation);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      
      const stats = schemaValidator.getValidationStats();
      expect(stats.totalValidations).toBe(1);
      expect(stats.validCount).toBe(0);
      expect(stats.invalidCount).toBe(1);
    });

    test('should fail validation for invalid timestamp format', () => {
      const invalidRecommendation = {
        id: 'test_invalid_timestamp',
        timestamp: 'invalid-timestamp',
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 0.8,
          explain: 'Test explanation'
        },
        channel_plan: [],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateCampaignRecommendation(invalidRecommendation);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.some(error => error.includes('timestamp'))).toBe(true);
    });

    test('should fail validation for invalid channel in channel_plan', () => {
      const invalidChannelRecommendation = {
        id: 'test_invalid_channel',
        timestamp: new Date().toISOString(),
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 0.8,
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'InvalidChannel', // Not in enum
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateCampaignRecommendation(invalidChannelRecommendation);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.some(error => error.includes('channel'))).toBe(true);
    });

    test('should fail validation for score out of range', () => {
      const invalidScoreRecommendation = {
        id: 'test_invalid_score',
        timestamp: new Date().toISOString(),
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 1.5, // Out of range (0.0-1.0)
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateCampaignRecommendation(invalidScoreRecommendation);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.some(error => error.includes('score') || error.includes('maximum'))).toBe(true);
    });
  });

  describe('Sanitization and Auto-fixing', () => {
    test('should sanitize and fix missing ID', () => {
      const incompleteRecommendation = {
        // Missing ID
        timestamp: new Date().toISOString(),
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 0.8,
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateAndSanitize(incompleteRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBeDefined();
      expect(result.sanitized!.id).toBeDefined();
      expect(result.sanitized!.id).toMatch(/^auto_/);
      expect(result.changes).toBeDefined();
      expect(result.changes!.includes('Generated missing id')).toBe(true);
    });

    test('should sanitize and fix invalid timestamp', () => {
      const invalidTimestampRecommendation = {
        id: 'test_123',
        timestamp: 'invalid-timestamp',
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 0.8,
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateAndSanitize(invalidTimestampRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBeDefined();
      expect(result.sanitized!.timestamp).toBeDefined();
      expect(new Date(result.sanitized!.timestamp)).toBeInstanceOf(Date);
      expect(result.changes).toBeDefined();
      expect(result.changes!.includes('Fixed invalid timestamp')).toBe(true);
    });

    test('should sanitize and fix missing audience structure', () => {
      const missingAudienceRecommendation = {
        id: 'test_123',
        timestamp: new Date().toISOString(),
        // Missing audience
        reasoning: {
          signals: ['test signal'],
          score: 0.8,
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 0.8
        }
      };

      const result = schemaValidator.validateAndSanitize(missingAudienceRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBeDefined();
      expect(result.sanitized!.audience).toBeDefined();
      expect(result.sanitized!.audience.segment_id).toBe('auto-generated');
      expect(result.changes).toBeDefined();
      expect(result.changes!.includes('Fixed missing audience structure')).toBe(true);
    });

    test('should sanitize out-of-range scores', () => {
      const outOfRangeScoreRecommendation = {
        id: 'test_123',
        timestamp: new Date().toISOString(),
        audience: {
          segment_id: 'test-segment',
          name: 'Test Segment',
          filters: {}
        },
        reasoning: {
          signals: ['test signal'],
          score: 1.5, // Out of range
          explain: 'Test explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              body: 'Test message',
              cta: {},
              metadata: {}
            },
            delivery_instructions: {
              retry_policy: 'test',
              timeout_sec: 30
            }
          }
        ],
        campaign_meta: {
          source_snapshot: {},
          engine_version: 'v1.0',
          confidence: 1.2 // Also out of range
        }
      };

      const result = schemaValidator.validateAndSanitize(outOfRangeScoreRecommendation);
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBeDefined();
      expect(result.sanitized!.reasoning.score).toBeLessThanOrEqual(1.0);
      expect(result.sanitized!.reasoning.score).toBeGreaterThanOrEqual(0.0);
      expect(result.sanitized!.campaign_meta.confidence).toBeLessThanOrEqual(1.0);
      expect(result.sanitized!.campaign_meta.confidence).toBeGreaterThanOrEqual(0.0);
    });
  });

  describe('Batch Validation', () => {
    test('should validate multiple recommendations in batch', () => {
      const validRecommendation = schemaValidator.generateSampleValidRecommendation();
      const invalidRecommendation = { id: 'invalid' }; // Missing required fields
      
      const recommendations = [validRecommendation, invalidRecommendation, validRecommendation];
      
      const result = schemaValidator.validateBatch(recommendations);
      
      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(1);
      expect(result.results).toHaveLength(3);
      expect(result.results[0].valid).toBe(true);
      expect(result.results[1].valid).toBe(false);
      expect(result.results[2].valid).toBe(true);
    });

    test('should handle empty batch validation', () => {
      const result = schemaValidator.validateBatch([]);
      
      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(0);
      expect(result.results).toHaveLength(0);
    });
  });

  describe('Statistics Tracking', () => {
    test('should track validation statistics correctly', () => {
      const validRecommendation = schemaValidator.generateSampleValidRecommendation();
      const invalidRecommendation = { id: 'invalid' };
      
      // Perform multiple validations
      schemaValidator.validateCampaignRecommendation(validRecommendation);
      schemaValidator.validateCampaignRecommendation(invalidRecommendation);
      schemaValidator.validateCampaignRecommendation(validRecommendation);
      
      const stats = schemaValidator.getValidationStats();
      
      expect(stats.totalValidations).toBe(3);
      expect(stats.validCount).toBe(2);
      expect(stats.invalidCount).toBe(1);
      expect(Object.keys(stats.mostCommonErrors).length).toBeGreaterThan(0);
    });

    test('should reset statistics correctly', () => {
      const validRecommendation = schemaValidator.generateSampleValidRecommendation();
      
      // Perform some validations
      schemaValidator.validateCampaignRecommendation(validRecommendation);
      schemaValidator.validateCampaignRecommendation({ id: 'invalid' });
      
      let stats = schemaValidator.getValidationStats();
      expect(stats.totalValidations).toBe(2);
      
      // Reset statistics
      schemaValidator.resetValidationStats();
      
      stats = schemaValidator.getValidationStats();
      expect(stats.totalValidations).toBe(0);
      expect(stats.validCount).toBe(0);
      expect(stats.invalidCount).toBe(0);
      expect(stats.mostCommonErrors).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined inputs', () => {
      const nullResult = schemaValidator.validateCampaignRecommendation(null);
      const undefinedResult = schemaValidator.validateCampaignRecommendation(undefined);
      
      expect(nullResult.valid).toBe(false);
      expect(undefinedResult.valid).toBe(false);
    });

    test('should handle empty object input', () => {
      const result = schemaValidator.validateCampaignRecommendation({});
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    test('should handle complex nested structure validation', () => {
      const complexRecommendation = {
        id: 'complex_test',
        timestamp: new Date().toISOString(),
        audience: {
          segment_id: 'complex-segment',
          name: 'Complex Segment',
          filters: {
            nested: {
              deeply: {
                nested: {
                  value: true,
                  array: [1, 2, 3],
                  object: { key: 'value' }
                }
              }
            }
          }
        },
        reasoning: {
          signals: ['Complex signal 1', 'Complex signal 2'],
          score: 0.95,
          explain: 'Complex reasoning explanation'
        },
        channel_plan: [
          {
            channel: 'Email',
            send_at: new Date().toISOString(),
            priority: 1,
            payload: {
              subject: 'Complex subject',
              title: 'Complex title',
              body: 'Complex body message',
              cta: {
                text: 'Click here',
                url: 'https://example.com',
                action: 'click',
                tracking: {
                  campaign_id: 'camp_123',
                  utm_source: 'email',
                  utm_medium: 'campaign'
                }
              },
              metadata: {
                template_id: 'email_template_1',
                personalization: {
                  first_name: 'John',
                  last_name: 'Doe'
                },
                ab_test: {
                  variant: 'A',
                  test_id: 'test_123'
                }
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
            multiple: {
              sources: {
                with: {
                  nested: 'data'
                }
              }
            }
          },
          engine_version: 'v1.0-complex',
          confidence: 0.92
        }
      };

      const result = schemaValidator.validateCampaignRecommendation(complexRecommendation);
      
      expect(result.valid).toBe(true);
    });
  });
});