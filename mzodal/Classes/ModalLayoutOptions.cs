using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mzodal.Classes
{
	public class ModalLayoutOptions
	{
		/// <summary>
		/// The width of the modal - height is always automatic
		/// </summary>
		public ModalSize Size { get; set; }

		/// <summary>
		/// Show a close button in the top right of the modal
		/// </summary>
		public bool ShowCloseButton { get; set; }

		/// <summary>
		/// When true this page will not be added to the modal history stack
		/// </summary>
		public bool ExcludeFromHistoryStack { get; set; }

		/// <summary>
		/// Setting to true prevents the modal from being closed by clicking on the background
		/// </summary>
		public bool DisableBackgroundClose { get; set; }

		/// <summary>
		/// Optional name or identifier for this view. Used by the history feature to overwrite views that re-appear after e.g validation errors
		/// </summary>
		public string Name { get; set; }

		public ModalLayoutOptions()
		{
			// defaults
			Size = ModalSize.Large;
			ShowCloseButton = true;
			ExcludeFromHistoryStack = false;
			DisableBackgroundClose = false;
		}

		public static ModalLayoutOptions Default
		{
			get
			{
				return new ModalLayoutOptions();
			}
		}
	}

	public class ModalSize
	{
		public static ModalSize ExtraSmall = new ModalSize("Small", "xs");
		public static ModalSize Small = new ModalSize("Small", "s");
		public static ModalSize Medium = new ModalSize("Medium", "m");
		public static ModalSize Large = new ModalSize("Large", "l");
		public static ModalSize Fullscreen = new ModalSize("Fullscreen", "");

		public string Name { get; private set; }
		public string CssClass { get; private set; }

		private ModalSize(string name, string cssClass)
		{
			Name = name;
			CssClass = cssClass;
		}
	}
}