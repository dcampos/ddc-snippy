import {
  Item,
  Previewer,
} from "jsr:@shougo/ddc-vim@~9.4.0/types";
import {
  BaseSource,
  GatherArguments,
  OnCompleteDoneArguments,
  GetPreviewerArguments,
} from "jsr:@shougo/ddc-vim@~9.4.0/source";

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

  override async onCompleteDone({
    denops,
  }: OnCompleteDoneArguments<Params, UserData>): Promise<void> {
    await denops.call(
      "luaeval",
      "require('snippy').complete_done()",
      {},
    );

    await denops.call("ddc#skip_next_complete");
  }

  override async getPreviewer({
    denops,
    item,
  }: GetPreviewerArguments<Params, UserData>): Promise<Previewer> {
    const userData = item.user_data;
    if (userData == null) {
      return { kind: "empty" };
    }

    const body: string = userData.snippy.snippet;
    const repr = await denops.call(
      "luaeval",
      "require('snippy').get_repr(_A)",
      body
    ) as string;

    const contents: string[] = repr.replaceAll(/\r\n?/g, "\n").split("\n");

    const ftype = await denops.eval('&filetype');
    contents.unshift("```" + ftype);
    contents.push("```");

    return { kind: "markdown", contents };
  }

  params(): Params { return {}; }
}
