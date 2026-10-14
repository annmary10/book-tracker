# Prompt Log

These are reconstructed prompt summaries for the submission, not a verbatim transcript. Adjust them to match the prompts you actually used before submitting.

## Five Prompt Summaries

1. Build a personal book tracker in plain HTML, CSS, and JavaScript that can deploy directly to GitHub Pages. List the files before creating them.
2. Add a book form with title, author, reading status, optional rating, cover URL, and personal notes. Let me edit or remove books from the shelf.
3. Save the library in localStorage so books and their statuses remain after refreshing. Add search by title or author and filters for reading status.
4. Make the shelf responsive and accessible. Include useful empty states, reading counts, and sorting by recently added, title, or author.
5. Review the optional cover-image fallback. If a cover URL fails, show a generated cover without removing the book's edit and remove controls.

## AI Mistake Reflection Draft

The first broken-cover fallback replaced the whole cover area, which also removed the edit and remove buttons for that book. The fix was to keep the card controls in place and switch only the failed image to a fallback cover. Confirm this matches what you observed and edit it into your own words before submitting.