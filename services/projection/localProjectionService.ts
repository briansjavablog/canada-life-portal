import type { Projection, ProjectionRequest } from '@/models';
import { buildProjection } from '@/utils/projectionMath';

/**
 * Deterministic projection used by mock mode.
 * Replace this class with a client that calls an internal projection API.
 * The screen talks to ProjectionRepository, not to this class directly.
 */
export class LocalProjectionService {
  project(request: ProjectionRequest): Promise<Projection> {
    return Promise.resolve(buildProjection(request));
  }
}
