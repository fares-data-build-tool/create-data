import Cookies from 'cookies';
import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';

export function deleteCookieOnServerSide(ctx: NextPageContext, cookieName: string){
    var cookies = new Cookies(ctx.req, ctx.res, { })
    var date = new Date();
    date.setDate(date.getDate() - 1);
    const host = ctx.req.headers.host;
    const domain =  host.split(":")[0];
    cookies.set(cookieName, "", { overwrite: true, expires: date, domain: domain, path: "/"});
}

export function getHost(req: IncomingMessage) {
    if (!req) return ''
    const { host } = req.headers
    if (host.startsWith('localhost')) {
      return `http://${host}`
    }
    return `https://${host}`
}

export async function isSessionValid(url: string, req: IncomingMessage) {
  return await axios
    .get(url, {
        withCredentials: true,
        headers: {
            Cookie: req.headers.cookie
        }
      })
    .then(
      response => {
        return response.data.Valid
      })
    .catch(
      error => {
        console.log("The validate api returned "+error.message);
        return false;          
      }
    );
}
