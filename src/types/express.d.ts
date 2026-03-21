declare namespace Express {
  interface Request {
    user?: {
      id: string;
      document: string;
      role: "super_admin" | "network_admin" | "school_admin" | "teacher" | "student";
      networkId?: string;
      schoolId?: string;
    };
  }
}
