using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mzodal.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }

		public ActionResult BasicModal()
        {
            return View("BasicModal");
        }
	}
}