export interface CreateAdminRequest {
  name: string;
  document: string;
  password: string;
  role: "network_admin" | "school_admin";
  networkId?: string;
  schoolId?: string;
}

export interface CreateAdminResponse {
  id: string;
  name: string;
  document: string;
  role: string;
  networkId: string | null;
  schoolId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
