import { Request, Response } from "express";
import { ProcessComplianceCallbackService } from "../../services/compliance/ProcessComplianceCallbackService";
import { ComplianceCallbackPayload } from "../../services/compliance/ProcessComplianceCallbackService";

class ComplianceCallbackController {
  constructor(
    private processComplianceCallbackService: ProcessComplianceCallbackService,
  ) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const { attemptId } = req.params;
    const payload = req.body as ComplianceCallbackPayload;

    await this.processComplianceCallbackService.execute(attemptId, payload);

    res.status(200).json({ received: true });
  };
}

export { ComplianceCallbackController };
