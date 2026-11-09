import {describe,it,expect} from 'vitest';import {zeusToken,validateRedirectUri,normalMac,authorizationUrl} from '../src/lib/captive';
describe('Intelbras captive adapter',()=>{
 it('normalizes mac',()=>expect(normalMac('AA:BB:CC:DD:EE:FF')).toBe('aabbccddeeff'));
 it('signs deterministically',()=>expect(zeusToken('abc','123','secret')).toMatch(/^[a-f0-9]{64}$/));
 it('rejects off-host redirect',()=>expect(()=>validateRedirectUri('http://evil.test/cp/itbcaptive.cgi','10.0.0.1')).toThrow());
 it('restricts AP path',()=>expect(()=>validateRedirectUri('http://10.0.0.1/admin','10.0.0.1')).toThrow());
 it('builds bounded authorization parameters',()=>{const u=new URL(authorizationUrl({uri:'http://10.0.0.1:2061/cp/itbcaptive.cgi',userHash:'abc',ts:'123',secret:'secret',seconds:3600}));expect(u.searchParams.get('session_timeout')).toBe('3600');expect(u.searchParams.get('token')).toHaveLength(64);});
});
