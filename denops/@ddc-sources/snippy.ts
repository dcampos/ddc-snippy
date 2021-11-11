import {
  BaseSource,
  Candidate,
  Context,
} from "https://deno.land/x/ddc_vim@v0.13.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddc_vim@v0.13.0/deps.ts#^";

export class Source extends BaseSource<{}> {
  async gatherCandidates(
    args: GatherCandidatesArguments<Params>,
  ): Promise<Candidate[]> {
    this.counter = (this.counter + 1) % 100;

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

  params(): {} { return {}; }
}
