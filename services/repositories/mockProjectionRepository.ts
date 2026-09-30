import { findScenario, projectionScenarios } from '@/data/scenarios';
import type { Projection, ProjectionRequest, ProjectionScenario, ProjectionScenarioId } from '@/models';
import { LocalProjectionService } from '@/services/projection/localProjectionService';
import type { ProjectionRepository } from '@/services/repositories/types';

export class MockProjectionRepository implements ProjectionRepository {
  constructor(private readonly service = new LocalProjectionService()) {}

  async listScenarios(): Promise<ProjectionScenario[]> {
    return projectionScenarios.map((scenario) => ({ ...scenario }));
  }

  async getScenario(id: ProjectionScenarioId): Promise<ProjectionScenario> {
    return { ...findScenario(id) };
  }

  project(request: ProjectionRequest): Promise<Projection> {
    return this.service.project(request);
  }
}
