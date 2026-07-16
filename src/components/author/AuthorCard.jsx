export default function AuthorCard({ author }) {
  if (!author) return null;
  return (
    <div className="flex items-center gap-3">
      <img
        src={author.avatar_url || "/avatar-placeholder.png"}
        alt={author.name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <p className="text-sm font-semibold text-ink">{author.name}</p>
        {author.bio && <p className="line-clamp-1 text-xs text-muted">{author.bio}</p>}
      </div>
    </div>
  );
}
