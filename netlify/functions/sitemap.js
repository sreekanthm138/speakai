// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.VITE_SUPABASE_URL,
//   process.env.VITE_SUPABASE_ANON_KEY
// );

export default async () => {
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("slug, created_at");

    if (error) {
      throw error;
    }

    const staticPages = ["", "/blog", "/coach", "/resources", "/contact"];

    const staticUrls = staticPages
      .map(
        (page) => `
      <url>
        <loc>https://speakai.in${page}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `,
      )
      .join("");

    const blogUrls = (blogs || [])
      .map(
        (blog) => `
      <url>
        <loc>
          https://speakai.in/blog/${blog.slug}
        </loc>

        <lastmod>
          ${new Date(blog.created_at).toISOString()}
        </lastmod>

        <changefreq>weekly</changefreq>

        <priority>0.8</priority>
      </url>
    `,
      )
      .join("");

    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>

      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      >

        ${staticUrls}

        ${blogUrls}

      </urlset>
    `;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (e) {
    return new Response("Failed to generate sitemap", { status: 500 });
  }
};
