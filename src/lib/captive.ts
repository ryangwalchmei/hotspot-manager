import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
export const entrySchema=z.object({
 mac:z.string().regex(/^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i),
 ap_mac:z.string().regex(/^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i),
 ip:z.string().min(3), user_hash:z.string().min(4).max(512),
 ts:z.string().regex(/^\d{8,15}$/),redirect_uri:z.string().url(),
 continue:z.string().optional(), ssid:z.string().optional(),radio:z.string().optional()
});
export function normalMac(mac:string){return mac.replace(/[:-]/g,'').toLowerCase();}
export function validateRedirectUri(uri:string, expectedHost:string){
 const parsed=new URL(uri);
 if(parsed.protocol!=='http:' && parsed.protocol!=='https:') throw new Error('Invalid AP scheme');
 if(parsed.hostname!==expectedHost) throw new Error('Unexpected AP hostname');
 if(!/^\/cp\/[a-z0-9_-]+\.cgi$/i.test(parsed.pathname)) throw new Error('Unexpected captive endpoint');
 if(parsed.username || parsed.password || parsed.hash) throw new Error('Invalid AP URL');
 return parsed;
}
export function zeusToken(userHash:string, ts:string, secret:string){return createHmac('sha256',secret).update(`${userHash}|${ts}`).digest('hex');}
export function safeHexCompare(a:string,b:string){
 if(!/^[a-f0-9]{64}$/i.test(a)|| !/^[a-f0-9]{64}$/i.test(b)) return false;
 return timingSafeEqual(Buffer.from(a,'hex'), Buffer.from(b,'hex'));
}
export function authorizationUrl(args:{uri:string,userHash:string,ts:string,secret:string,seconds:number,downloadKbps?:number|null,uploadKbps?:number|null,continueUrl?:string|null}){
 const uri=new URL(args.uri);
 uri.searchParams.set('user_hash',args.userHash);
 uri.searchParams.set('ts',args.ts);
 uri.searchParams.set('token',zeusToken(args.userHash,args.ts,args.secret));
 uri.searchParams.set('session_timeout',String(args.seconds));
 if(args.downloadKbps) uri.searchParams.set('download_kbps',String(args.downloadKbps));
 if(args.uploadKbps) uri.searchParams.set('upload_kbps',String(args.uploadKbps));
 if(args.continueUrl) uri.searchParams.set('continue',args.continueUrl);
 return uri.toString();
}
