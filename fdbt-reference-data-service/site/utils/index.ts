import Cookies from 'cookies';
import { NextPageContext } from 'next';

export function deleteCookieOnServerSide(ctx: NextPageContext, cookieName: string){
    var cookies = new Cookies(ctx.req, ctx.res, { })
    var date = new Date();
    date.setDate(date.getDate() - 1);
    const host = ctx.req.headers.host;
    const domain =  host.split(":")[0];
    cookies.set(cookieName, "", { overwrite: true, expires: date, domain: domain, path: "/"});
}