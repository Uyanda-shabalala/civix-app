import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

export default function Board() {
  const { profile, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const ward = profile?.ward;

  useEffect(() => {
    if (!ward) return;
    loadPosts();
  }, [ward]);

  async function loadPosts() {
    setLoading(true);
    const { data } = await supabase
      .from("board_posts")
      .select("*, profiles(full_name)")
      .eq("ward", ward)
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim()) return;
    const { error } = await supabase.from("board_posts").insert({
      ward,
      user_id: user.id,
      content: content.trim(),
    });
    if (!error) {
      setContent("");
      loadPosts();
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 pt-5">
        <div className="text-xs text-brand-muted mb-4">
          My Ward (Board) &gt; Ward {ward} | Region
        </div>

        <form onSubmit={handlePost} className="card p-3 mb-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update with your ward…"
            className="w-full text-sm outline-none resize-none"
            rows={2}
          />
          <div className="flex justify-end">
            <button className="btn-primary px-4 py-2 text-xs">Post</button>
          </div>
        </form>

        {loading && <p className="text-sm text-brand-muted">Loading…</p>}
        {!loading && posts.length === 0 && (
          <p className="text-sm text-brand-muted">No posts in your ward yet. Be the first to share something.</p>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-[#dbe4fb] flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-brand-ink">{post.profiles?.full_name || "Resident"}</span>{" "}
                  <span className="text-brand-muted">· {timeAgo(post.created_at)} · Verified Resident</span>
                </div>
              </div>
              <p className="text-sm text-brand-ink leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
