How Hard can Rocket Science Be?
===============================

More importantly: How much more can we do?

Upload your Kerbal Space Program save file to get a quick run-down of the
science you haven't done on the celestial bodies you have visited.

[Deployed version](https://rosuav.github.io/how-hard/) requires only basic
JavaScript and does not send your save file to any other host.

TODO:

- List experiment types and which situations they're valid in
  - May require parsing GameData/Squad/Resources/ScienceDefs.cfg
  - For data lifted from there, acknowledge copyright
  - situationMask is bit pattern for which situations are meaningful
  - biomeMask is a corresponding bit pattern for where biomes matter
  - if requireAtmosphere and not body.atmo, skip
  - get title and translate through l10n
