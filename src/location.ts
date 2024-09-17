import IPinfoWrapper, { IPinfo } from "node-ipinfo";

interface IpLocator {
  getLocation: (ip: string) => Promise<IPinfo>;
}

export function getIpLocator(token: string): IpLocator {
  const ipinfoWrapper = new IPinfoWrapper(token);
  return {
    getLocation: (ip: string): Promise<IPinfo> => {
      return ipinfoWrapper.lookupIp(ip);
    },
  };
}
