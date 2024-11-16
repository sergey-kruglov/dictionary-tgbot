import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Actions } from "../lib/actions.ts";

export interface Command {
  name: string;
  handle(ctx: Context): Promise<void> | void;
}

export interface Message {
  handle(ctx: Context): Promise<void> | void;
}

export interface Callback {
  action: Actions;
  handle(ctx: Context): Promise<void> | void;
}
