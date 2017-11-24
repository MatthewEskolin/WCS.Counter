using System.Web;
using System.Web.Optimization;



namespace WCS.Counter
{
    public class BundleConfig
    {


        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.css",
                "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/counters").Include("~/Scripts/metronome.js", "~/Scripts/metronomeworker.js", "~/Scripts/AudioContextMonkeyPatch.js"));

        }






    }
}