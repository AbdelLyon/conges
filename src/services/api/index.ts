import { ApiService } from "./ApiService";
import { LeaveService } from "./LeaveService";


ApiService.initialize();

export const leaveService = new LeaveService();