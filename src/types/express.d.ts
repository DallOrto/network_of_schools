declare namespace Express {
  interface Request {
    user?: {
      id: string;
      document: string;
      role: "teacher" | "student";
    };
  }
}
