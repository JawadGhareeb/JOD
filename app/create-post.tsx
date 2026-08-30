import { CreatePostScreen } from "@/src/components/pages/create-post";

// A pushed stack screen, not a tab: it shows its own title + back arrow and no
// tab nav, matching groups/create. It used to sit under (tabs) with
// `href: null`, which made AppHeader render the tab nav on top of it.
export default function CreatePostPage() {
  return <CreatePostScreen />;
}
