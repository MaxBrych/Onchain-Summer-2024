const GET_PROFILE_INFO = `
  query GetProfileInfo($identity: Identity!) {
    Wallet(input: {identity: $identity, blockchain: ethereum}) {
      addresses
      primaryDomain {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      domains(input: {filter: {isPrimary: {_eq: false}}}) {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      xmtp {
        isXMTPEnabled
      }
    }
    farcasterSocials: Socials(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: farcaster}}, blockchain: ethereum, order: {followerCount: DESC}}
    ) {
      Social {
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
      }
    }
    lensSocials: Socials(
      input: {filter: {identity: {_eq: $identity}, dappName: {_eq: lens}}, blockchain: ethereum, order: {followerCount: DESC}}
    ) {
      Social {
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
      }
    }
    FarcasterCasts(
      input: {
        filter: {
          castedBy: {_eq: $identity}
        },
        blockchain: ALL
      }
    ) {
      Cast {
        castedAtTimestamp
        embeds
        url
        text
        numberOfRecasts
        numberOfLikes
        channel {
          channelId
        }
        mentions {
          fid
          position
        }
      }
    }
  }
`;

export default GET_PROFILE_INFO;
