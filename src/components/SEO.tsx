import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string;
  structuredData?: object;
}

export const SEO = ({
  title = 'DistroWiki - Comparação de Distribuições Linux para Desktop',
  description = 'Plataforma open source para comparar distribuições Linux de forma objetiva e transparente. Encontre a melhor distro para suas necessidades.',
  canonical = 'https://www.distrowiki.site/',
  ogType = 'website',
  ogImage = 'https://www.distrowiki.site/social-share-banner.png',
  ogImageAlt = 'DistroWiki - Comparação de Distribuições Linux',
  keywords = 'linux, distribuições linux, distros, comparação, open source, desktop, ubuntu, fedora, arch',
  structuredData
}: SEOProps) => {
  const fullTitle = title === 'DistroWiki - Comparação de Distribuições Linux para Desktop'
    ? title
    : `${title} | DistroWiki`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="DistroWiki" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
