import { useEffect } from "react";

/** Suntik script Google Analytics & Microsoft Clarity sekali di root app, kalau ID di-set di .env. */
export default function Analytics() {
  const gaId = import.meta.env.VITE_GA_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;

  useEffect(() => {
    if (gaId && !document.getElementById("ga-script")) {
      const s1 = document.createElement("script");
      s1.id = "ga-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s1);

      const s2 = document.createElement("script");
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(s2);
    }

    if (clarityId && !document.getElementById("clarity-script")) {
      const s3 = document.createElement("script");
      s3.id = "clarity-script";
      s3.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(s3);
    }
  }, [gaId, clarityId]);

  return null;
}
