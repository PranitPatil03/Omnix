import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react"
import { screenAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);

  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setScreen("selection")}
        size="icon"
        variant="ghost"
      >
        <img
          src="/images/icons/home.png"
          alt="Home"
          className={cn(
            "size-5 object-contain transition-all",
            screen === "selection" ? "opacity-100" : "opacity-50 hover:opacity-80"
          )}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setScreen("inbox")}
        size="icon"
        variant="ghost"
      >
        <img
          src="/images/icons/messages.png"
          alt="Messages"
          className={cn(
            "size-5 object-contain transition-all",
            screen === "inbox" ? "opacity-100" : "opacity-50 hover:opacity-80"
          )}
        />
      </Button>
    </footer>
  );
};
