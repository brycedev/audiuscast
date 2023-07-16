import {
  AppAuth,
  DiscoveryNodeSelector,
  EntityManager,
  StorageNodeSelector,
  UploadTrackRequest,
  sdk,
  stagingConfig
} from "@audius/sdk";

import fs from 'fs';

enum Genre {
    ALL = "All Genres",
    ELECTRONIC = "Electronic",
    ROCK = "Rock",
    METAL = "Metal",
    ALTERNATIVE = "Alternative",
    HIP_HOP_RAP = "Hip-Hop/Rap",
    EXPERIMENTAL = "Experimental",
    PUNK = "Punk",
    FOLK = "Folk",
    POP = "Pop",
    AMBIENT = "Ambient",
    SOUNDTRACK = "Soundtrack",
    WORLD = "World",
    JAZZ = "Jazz",
    ACOUSTIC = "Acoustic",
    FUNK = "Funk",
    R_AND_B_SOUL = "R&B/Soul",
    DEVOTIONAL = "Devotional",
    CLASSICAL = "Classical",
    REGGAE = "Reggae",
    PODCASTS = "Podcasts",
    COUNTRY = "Country",
    SPOKEN_WORK = "Spoken Word",
    COMEDY = "Comedy",
    BLUES = "Blues",
    KIDS = "Kids",
    AUDIOBOOKS = "Audiobooks",
    LATIN = "Latin",
    LOFI = "Lo-Fi",
    HYPERPOP = "Hyperpop",
    TECHNO = "Techno",
    TRAP = "Trap",
    HOUSE = "House",
    TECH_HOUSE = "Tech House",
    DEEP_HOUSE = "Deep House",
    DISCO = "Disco",
    ELECTRO = "Electro",
    JUNGLE = "Jungle",
    PROGRESSIVE_HOUSE = "Progressive House",
    HARDSTYLE = "Hardstyle",
    GLITCH_HOP = "Glitch Hop",
    TRANCE = "Trance",
    FUTURE_BASS = "Future Bass",
    FUTURE_HOUSE = "Future House",
    TROPICAL_HOUSE = "Tropical House",
    DOWNTEMPO = "Downtempo",
    DRUM_AND_BASS = "Drum & Bass",
    DUBSTEP = "Dubstep",
    JERSEY_CLUB = "Jersey Club",
    VAPORWAVE = "Vaporwave",
    MOOMBAHTON = "Moombahton"
}

const apiKey = "b6fd9c0350e052d7af5b9d2895c6481554d57999";
const apiSecret = "9fe73bd3d003d1af23a72b8ffa32709175da78c40987b657833372822c8b3902";

const discoveryNodeSelector = new DiscoveryNodeSelector({
  initialSelectedNode: "https://discoveryprovider.staging.audius.co/",
});

const audiusSdk = sdk({
  appName: "AudiusCast_Staging",
  services: {
    discoveryNodeSelector,
    entityManager: new EntityManager({
      discoveryNodeSelector,
      web3ProviderUrl: stagingConfig.web3ProviderUrl,
      contractAddress: stagingConfig.entityManagerContractAddress,
      identityServiceUrl: stagingConfig.identityServiceUrl,
    }),
    storageNodeSelector: new StorageNodeSelector({
      discoveryNodeSelector,
      auth: new AppAuth(apiKey, apiSecret),
      bootstrapNodes: [
        {
          delegateOwnerWallet: "0x671ddce7B4E676C9467F87e4031a917b5D6f75F0",
          endpoint: "https://usermetadata.staging.audius.co",
        },
      ],
    }),
  },
  apiKey: apiKey,
  apiSecret: apiSecret,
});

try {
    const uploadTrackRequest: UploadTrackRequest = {
      userId: '6o8Jw3',
      coverArtFile: {
        buffer: fs.readFileSync('cover.jpg'),
        name: 'my cover art'
      },
      metadata: { title: 'Run With Me', genre: Genre.ELECTRONIC },
      onProgress: (progress) => console.log("Progress:", progress),
      trackFile: {
        buffer: fs.readFileSync('run.mp3'),
        name: 'my track file'
      },
    };
    console.log(uploadTrackRequest)
    const result = await audiusSdk.tracks.uploadTrack(uploadTrackRequest);
    console.log(result)
  } catch (error) {
    console.log(error)
  }