"use client";
import { Workspace } from "./components/workspace/right_panel/workspace";
import { jumpGame } from "./utils/problems/jump-game";
import { Topbar } from "./components/workspace/top/topbar";

export default function Home() {
  return (
    <div>
      <Topbar problemPage={true} />
      <Workspace problem={jumpGame} />
    </div>
  );
}
