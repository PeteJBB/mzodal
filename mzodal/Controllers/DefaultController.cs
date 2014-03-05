using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mzodal.Models;

namespace mzodal.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

		public ActionResult BasicModal()
        {
            return View();
        }

		public ActionResult ConfirmationBox()
        {
            return View();
        }

		public ActionResult WizardStep1()
		{
			var model = new WizardModel();
            return View("WizardStep1", model);
        }

		public ActionResult WizardStep2(WizardModel model)
		{
            return View("WizardStep2", model);
        }

		public ActionResult WizardStep3(WizardModel model)
		{
            return View("WizardStep3", model);
        }

		public ActionResult WizardStep4(WizardModel model)
		{
            return View("WizardStep4", model);
        }
	}
}