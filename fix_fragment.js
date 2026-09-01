const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

content = content.replace(
  `                  </div>
                )}
              </div>
            );
          })()}`,
  `                  </div>
                  </>
                )}
              </div>
            );
          })()}`
);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed missing fragment end tag.');
