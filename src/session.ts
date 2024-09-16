import { getIronSession } from "iron-session";

type sessionOptions = {
  type: "iron" | "lucia"; // TODO: add lucia support
  cookieName: string;
  password: string;
  extraOptions?: Record<string, any>;
};

interface Session {
  session: any;
  set: (key: string, value: any) => Promise<void>;
  get: (key: string) => any;
  all: () => Record<string, any>;
  forget: (key: string) => void;
  destroy: () => void;
  regenerate: () => void;
}

export async function getSession(opts: sessionOptions): Promise<Session> {
  if (opts.type === "iron") {
    if (
      "extraOptions" in opts === false ||
      "cookies" in opts.extraOptions === false
    )
      throw new Error("Missing extraOptions.cookies for iron session");

    const session = await getIronSession(opts.extraOptions.cookies(), {
      cookieName: opts.cookieName,
      password: opts.password,
    });

    return ironSession(session);
  } else {
    throw new Error("Unsupported session type");
  }
}

function ironSession(session: any): Session {
  return {
    session,
    set: async (key: string, value: any) => {
      session[key] = value;
      await session.save();
    },
    get: (key: string) => {
      return session[key];
    },
    all: () => {
      return session;
    },
    forget: async (key: string) => {
      delete session[key];
      await session.save();
    },
    destroy: () => {
      session.destroy();
    },
    regenerate: async () => {
      // TODO: implement regenerate
    },
  };
}
