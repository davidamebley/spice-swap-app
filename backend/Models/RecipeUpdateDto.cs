public class RecipeUpdateDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Ingredients { get; set; }
    public string Steps { get; set; }
    public string ThumbnailUrl { get; set; }
    public int UserId { get; set; }
}
