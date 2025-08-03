import Joi from "joi";

export const addBlogValidationSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  content: Joi.string().min(10).required(),
  status: Joi.string().valid("draft", "published", "archived").required(),
  tags: Joi.array().items(Joi.string()),
  author: Joi.any(), // <-- Not recommended unless it's trusted input
});


export const paginationValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1),
  searchText: Joi.string().trim().allow(""),
});
