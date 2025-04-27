// types.ts
export interface UserHair {
   color: string;
   type: string;
}

export interface UserAddress {
   address: string;
   city: string;
   postalCode: string;
   state: string;
}

export interface UserBank {
   cardNumber: string;
   cardType: string;
   currency: string;
   iban: string;
}

export interface UserCompany {
   name: string;
   department: string;
   title: string;
}

export interface User {
   id: number;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   username: string;
   birthDate: string;
   image: string;
   bloodGroup: string;
   height: number;
   weight: number;
   eyeColor: string;
   hair: UserHair;
   domain: string;
   ip: string;
   address: UserAddress;
   gender: string;
   university: string;
   bank: UserBank;
   company: UserCompany;
}

export interface ApiResponse {
   users: User[];
   total: number;
   skip: number;
   limit: number;
}

export interface FetchUsersResult {
   items: User[];
   hasMore: boolean;
   total: number;
}