using System.ComponentModel.DataAnnotations;

namespace sopalapp.Models 
{
    public class Visitor
    {
        [Key] 
        public string CIN { get; set; }
        
        public string Nom { get; set; }
            [Required(ErrorMessage = "Le champ Nom est obligatoire.")]

        public string Prénom { get; set; }
            [Required(ErrorMessage = "Le champ Prénom est obligatoire.")]

        public string Société { get; set; }
        
        public string ButVisite { get; set; }
    public DateTime? EntryDateTime { get; set; }
    public DateTime? ExitDateTime { get; set; }

        // public Visitor(string CIN, string Nom, string Prénom, string Société, string ButVisite)
        // {
        //     this.CIN = CIN; // Ou une autre valeur par défaut selon votre logique métier
        //     this.Nom = Nom; // Initialisation avec une chaîne vide
        //     this.Prénom = Prénom; // Initialisation avec une chaîne vide
        //     this.Société = Société; // Initialisation avec une chaîne vide
        //    this. ButVisite = ButVisite; // Initialisation avec une chaîne vide
        // }
        public Visitor()
        {
            CIN = ""; // Ou une autre valeur par défaut selon votre logique métier
            Nom = ""; // Initialisation avec une chaîne vide
            Prénom = ""; // Initialisation avec une chaîne vide
            Société = ""; // Initialisation avec une chaîne vide
            ButVisite = ""; // Initialisation avec une chaîne vide
        }
    }
}
