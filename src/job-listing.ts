export interface JobListing {
    props: {
      pageProps: {
        job: {
          profession: string;
          budget: string;
          heartCount: number;
          applicationsCount: number;
          listingTitle: string;
          published: boolean;
          updatedAt: string;
          createdAt: string;
          thumbnail: string;
          endDate: string | null;
          companyUid: string;
          industry: string;
          listingDescription: string;
          newApplicationsCount: number;
          location: string;
          shareableImage: string | null;
          startDate: string;
          uid: string;
        };
        company: {
          createdAt: string;
          image: string;
          slug: string;
          phoneNumber: string | null;
          users: string[];
          uid: string;
          name: string;
          updatedAt: string;
        };
        expired: boolean;
      };
      __N_SSP: boolean;
    };
    page: string;
    query: {
      jobUid: string;
    };
    buildId: string;
    isFallback: boolean;
    gssp: boolean;
    scriptLoader: any[]; // You might want to create a more specific type for scriptLoader
  }
  