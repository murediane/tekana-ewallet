import { number } from "yargs";

export enum Environonement{
    Production= 'production',
    Development ='developement'

}
export interface configuration {
    env:Environonement;
    port:string
    database:{
        url:string;
    }
    isDev(): boolean;
    isPRod(): boolean;
    jwt:{
        secret :string;
        expiresIn : string | number;
    }
}
export default (): configuration =>({
    env: process.env.NODE_ENV as Environonement,
    port : process.env .PORT,
    database :{
        url: process.env.DB_URL,
    },
    isDev(): boolean{
        return process.env.NODE_ENV === 'developement';
    },
    isPRod(): boolean {
        return process.env.NODE_ENV ==='production';
    },
    jwt :{
        secret: process.env.JWT_SECRET,
        expiresIn: process.env. JWT_EXPIRES_IN,
    }
})