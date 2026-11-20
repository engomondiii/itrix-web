// Keep SharePoint's colon-containing path literal, outside redirect pattern parsing.
export function GET() {
  return Response.redirect(
    'https://itrix1216-my.sharepoint.com/:f:/g/personal/ipark_itrix_co_kr/IgDalt-AtZNmRKkLgb66oua_AeesoP7eDkIyEnygufckOFY',
    307,
  );
}
