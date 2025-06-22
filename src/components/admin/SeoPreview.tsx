
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Facebook, Twitter, Globe } from "lucide-react";

interface SeoPreviewProps {
  seoSettings: {
    page_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    twitter_title: string;
    twitter_description: string;
    canonical_url: string;
  };
}

export const SeoPreview = ({ seoSettings }: SeoPreviewProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Náhľad SEO
          </CardTitle>
          <CardDescription>
            Ako bude vaša stránka vyzerať vo vyhľadávačoch a sociálnych sieťach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Search Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Google vyhľadávanie</span>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
                {seoSettings.page_title || "Apartmán Tília - Bešeňová"}
              </div>
              <div className="text-green-700 text-sm mb-2">
                {seoSettings.canonical_url || "https://apartman-tilia.sk"}
              </div>
              <div className="text-gray-600 text-sm">
                {seoSettings.meta_description || "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová."}
              </div>
            </div>
          </div>

          {/* Facebook Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Facebook zdieľanie</span>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Náhľad obrázka</span>
              </div>
              <div className="p-3">
                <div className="text-sm text-gray-500 uppercase mb-1">
                  {new URL(seoSettings.canonical_url || "https://apartman-tilia.sk").hostname}
                </div>
                <div className="font-semibold text-gray-800 mb-1">
                  {seoSettings.og_title || seoSettings.page_title || "Apartmán Tília - Bešeňová"}
                </div>
                <div className="text-gray-600 text-sm">
                  {seoSettings.og_description || seoSettings.meta_description || "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová."}
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Twitter className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Twitter Card</span>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white max-w-md">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Náhľad obrázka</span>
              </div>
              <div className="p-3">
                <div className="font-semibold text-gray-800 mb-1">
                  {seoSettings.twitter_title || seoSettings.og_title || seoSettings.page_title || "Apartmán Tília - Bešeňová"}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  {seoSettings.twitter_description || seoSettings.og_description || seoSettings.meta_description || "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová."}
                </div>
                <div className="text-gray-500 text-xs">
                  {new URL(seoSettings.canonical_url || "https://apartman-tilia.sk").hostname}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Score */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">SEO skóre</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Dobré
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Dĺžka titulku</span>
                <Badge variant={seoSettings.page_title.length <= 60 ? "default" : "destructive"}>
                  {seoSettings.page_title.length}/60
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Dĺžka popisu</span>
                <Badge variant={seoSettings.meta_description.length <= 160 ? "default" : "destructive"}>
                  {seoSettings.meta_description.length}/160
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
