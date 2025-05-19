import { ApiService } from "./ApiService";
import { LeaveService } from "./LeaveService";
import { UserService } from "./UserService";


ApiService.initialize();

export const leaveService = new LeaveService();
export const userSerivuce = new UserService();
