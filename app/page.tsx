import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Futura, 'Century Gothic', system-ui, sans-serif",
        background: "linear-gradient(160deg, #0f0f12 0%, #1a1a22 50%, #0d0d10 100%)",
        color: "#e8e6e3",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 700,
          letterSpacing: "0.15em",
          marginBottom: "0.5rem",
          textTransform: "uppercase",
        }}
      >
        AURAPOSTER
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          opacity: 0.85,
          marginBottom: "2.5rem",
          textAlign: "center",
          maxWidth: "28rem",
        }}
      >
        Turn your Spotify listening into a series of abstract wheatpasted poster specs.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/api/auth/signin"
          style={{
            display: "inline-block",
            padding: "0.85rem 1.75rem",
            background: "#1db954",
            color: "#000",
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: "4px",
            transition: "background 0.2s, transform 0.15s",
          }}
        >
          Sign in with Spotify
        </Link>
        <a
          href="/api/auraspec"
          style={{
            display: "inline-block",
            padding: "0.85rem 1.75rem",
            border: "2px solid #e8e6e3",
            color: "#e8e6e3",
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: "4px",
            transition: "border-color 0.2s, color 0.2s",
          }}
        >
          Get AuraSpec (API)
        </a>
      </div>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", opacity: 0.6 }}>
        Sign in first, then hit the API to generate your poster spec.
      </p>
    </main>
  );
}
