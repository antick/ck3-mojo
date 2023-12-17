const path = require('path');
const config = require('./config');
const modConfig = require('./config/mods');
const syncGameFiles = require('./scripts/sync-game-files');
const modBuilder = require('./scripts/mod-builder');

async function buildModsInLocal(selectedModKeys, buildCombinedMod) {
  if (!selectedModKeys.length) {
    throw new Error('No mods selected for building');
  }

  if (buildCombinedMod) {
    const modFileName = `${modConfig.combinedMod.modFolderName}.mod`;

    try {
      await modBuilder.buildModFile(config.localModBuildPath, modFileName);
    } catch (error) {
      console.error('Error while processing mojo.mod file:', error);
      return error;
    }

    const modBuildPath = path.join(config.localModBuildPath, modConfig.combinedMod.modFolderName);

    try {
      await modBuilder.buildCombinedMod(modBuildPath, selectedModKeys);
    } catch (error) {
      console.error(`Error building combined mod in local: ${error}`);
      return error;
    }
  } else {
    try {
      await modBuilder.buildLooseMods(config.localModBuildPath, selectedModKeys);
    } catch (error) {
      console.error(`Error building selected mod(s) in local: ${error}`);
      return error;
    }
  }

  return null;
}

async function buildModsInGame(selectedModKeys, buildCombinedMod) {
  if (!selectedModKeys.length) {
    throw new Error('No mods selected for building');
  }

  if (buildCombinedMod) {
    const modFileName = `${modConfig.combinedMod.modFolderName}.mod`;

    try {
      await modBuilder.buildModFile(config.ck3GameModPath, modFileName);
    } catch (error) {
      console.error('Error while processing mojo.mod file:', error);
      return error;
    }

    const modBuildPath = path.join(config.ck3GameModPath, modConfig.combinedMod.modFolderName);

    try {
      await modBuilder.buildCombinedMod(modBuildPath, selectedModKeys);
    } catch (error) {
      console.error(`Error building combined mod in game: ${error}`);
      return error;
    }
  } else {
    try {
      await modBuilder.buildLooseMods(config.ck3GameModPath, selectedModKeys);
    } catch (error) {
      console.error(`Error building selected mod(s) in game: ${error}`);
      return error;
    }
  }

  return null;
}

async function syncCk3GameFiles() {
  try {
    await syncGameFiles.syncCk3Files(config.gameFoldersToSync);
    console.log(`📦 Synced CK3 game files to ${config.syncedCk3Folder}`);
  } catch (error) {
    console.error(`Error syncing CK3 game files: ${error}`);
    return error;
  }

  console.log(`Synced CK3 game files to ${config.syncedCk3Folder}`);
  return null;
}

module.exports = {
  buildModsInLocal,
  buildModsInGame,
  syncCk3GameFiles,
};
