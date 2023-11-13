import {
  BaseSource,
  Item
} from "https://deno.land/x/ddc_vim@v4.1.0/types.ts";
import {
  GatherArguments,
  OnCompleteDoneArguments,
} from "https://deno.land/x/ddc_vim@v4.1.0/base/source.ts";

type Params = Record<never, never>;

type UserData = {
  snippy: {
    snippet: string;
  }
}

export class Source extends BaseSource<Params> {
  async gather(
    args: GatherArguments<Params>
  ): Promise<Item[]> {
    const result = await args.denops.call(
      "luaeval",
      "require('snippy').get_completion_items()",
      {},
    );

    if (result?.length == null) {
      return [];
    }

    return result
  }

  async onCompleteDone({
    denops,
  }: OnCompleteDoneArguments<Params, UserData>): Promise<void> {
    await denops.call(
      "luaeval",
      "require('snippy').complete_done()",
      {},
    );

    await denops.call("ddc#skip_next_complete");
  }

  params(): Params { return {}; }
}
