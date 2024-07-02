using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopalapp.Models;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace sopalapp.Controllers
{
    public class FormController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FormController> _logger;

        public FormController(ApplicationDbContext context, ILogger<FormController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Créer un nouveau visiteur";
            return View(new Visitor());
        }

        [HttpPost]
      public async Task<IActionResult> Create([FromBody] Visitor model)
             {
    _logger.LogInformation("Début de la méthode Create.");

    if (ModelState.IsValid)
    {
        try
        {
            var existingVisitor = await _context.Visitors.FirstOrDefaultAsync(v => v.CIN == model.CIN);

            if (existingVisitor == null)
            {
                model.EntryDateTime = DateTime.Now; // Enregistre l'heure et la date d'entrée actuelles
                _context.Visitors.Add(model);
                _logger.LogInformation("Nouveau visiteur ajouté avec CIN généré: {CIN}", model.CIN);
            }
            else
            {
                // Mettre à jour les informations du visiteur existant
                existingVisitor.Nom = model.Nom;
                existingVisitor.Prénom = model.Prénom;
                existingVisitor.Société = model.Société;
                existingVisitor.ButVisite = model.ButVisite;
                existingVisitor.EntryDateTime = DateTime.Now;
                existingVisitor.ExitDateTime=null;
                _context.Visitors.Update(existingVisitor);
                _logger.LogInformation("Visiteur existant mis à jour: {CIN}", model.CIN);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Les modifications ont été enregistrées dans la base de données.");
            return Ok(new { message = "Visiteur traité avec succès." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création ou de la mise à jour du visiteur.");
            return BadRequest("An error occurred while saving the visitor. Please try again.");
        }
    }
    else
    {
        _logger.LogWarning("Le modèle est invalide.");
        return BadRequest("Invalid model.");
    }
}

        public IActionResult NouveauVisiteur()
        {
            return RedirectToAction("Create", "Form"); // Redirige vers l'action Create du contrôleur Form
        }

        public IActionResult Bienvenue()
        {
            ViewData["Title"] = "Bienvenue chez SOPAL";
            return View();
        }

        public IActionResult History()
        {
            var visitors = _context.Visitors.Where(v => v.ExitDateTime == null).ToList();
            return View(visitors);
        }

        [HttpPost]
        public async Task<IActionResult> SaveExitTime([FromBody] Visitor visitor)
        {
            if (visitor == null || string.IsNullOrEmpty(visitor.CIN))
            {
                return BadRequest("Visitor CIN is required.");
            }

            var existingVisitor = await _context.Visitors.FindAsync(visitor.CIN);
            if (existingVisitor == null)
            {
                return NotFound("Aucun visiteur trouvé avec ce CIN.");
            }

            existingVisitor.ExitDateTime = DateTime.Now;
            await _context.SaveChangesAsync();

               Console.WriteLine("Heure de sortie enregistrée avec succès.");
               return NoContent();  
;
        }

        public IActionResult SearchVisitors()
        {
            ViewData["Title"] = "Recherche de visiteurs par date";
            return View();
        }

        [HttpPost]
        public IActionResult SearchVisitors(DateTime searchDate)
        {
            var visitors = _context.Visitors
                .Where(v => v.EntryDateTime.HasValue &&
                            v.EntryDateTime.Value.Date == searchDate.Date) // Ajouter condition pour ExitDateTime == null
                .ToList();

            var sb = new StringBuilder();
            {
                sb.Append("<table>");
                sb.Append("<thead><tr>");
                sb.Append("<th>CIN</th>");
                sb.Append("<th>Nom</th>");
                sb.Append("<th>Prénom</th>");
                sb.Append("<th>Société</th>");
                sb.Append("<th>But de visite</th>");
                sb.Append("<th>Date d'entrée</th>");
                sb.Append("<th>Date de sortie</th>");
                sb.Append("</tr></thead>");
                sb.Append("<tbody>");

                foreach (var visitor in visitors)
                {
                    sb.Append("<tr>");
                    sb.AppendFormat("<td>{0}</td>", visitor.CIN);
                    sb.AppendFormat("<td>{0}</td>", visitor.Nom);
                    sb.AppendFormat("<td>{0}</td>", visitor.Prénom);
                    sb.AppendFormat("<td>{0}</td>", visitor.Société);
                    sb.AppendFormat("<td>{0}</td>", visitor.ButVisite);
                    sb.AppendFormat("<td>{0}</td>", visitor.EntryDateTime?.ToString("dd/MM/yyyy HH:mm"));
                    sb.AppendFormat("<td>{0}</td>", visitor.ExitDateTime?.ToString("dd/MM/yyyy HH:mm"));
                    sb.Append("</tr>");
                }

                sb.Append("</tbody></table>");
            }

            return Content(sb.ToString(), "text/html");
        }

       
    }
}
