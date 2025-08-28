export class HealthRepository {
  async ping() { return { ok: true, ts: Date.now() }; }
}
