import { client, selectSp } from '@/client';
import { getOffchainAuthKeys, getOffchainAuthKeysTest } from '@/utils/offchainAuth';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

export const Demo = () => {
  const { address, connector } = useAccount();
  const [createBucketInfo, setCreateBucketInfo] = useState<{
    bucketName: string;
  }>({
    bucketName: '',
  });

  // <!-- OBJ Logic
  const [file, setFile] = useState<File>();
  const [txHash, setTxHash] = useState<string>();
  const [createObjectInfo, setCreateObjectInfo] = useState({
    bucketName: '',
    objectName: '',
  });

  // --!>

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            Movespace Greenfield Client
          </h1>


        </div>
      </section>

      {/* Bucket Creator */}
      <div className='box'>
          
        <center>
        <p className="subtitle">
          Create Bucket
        </p>
        </center>
        <br></br>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Bucket</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={createBucketInfo.bucketName}
                  placeholder="bucket name"
                  onChange={(e) => {
                    setCreateBucketInfo({ ...createBucketInfo, bucketName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <center>
          <button
            className="button is-primary"
            onClick={async () => {
            if (!address) return;

            const spInfo = await selectSp();
            console.log('spInfo', spInfo);

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            try {
              console.log('offChainData', offChainData);

              const createBucketTx = await client.bucket.createBucket(
                {
                  bucketName: createBucketInfo.bucketName,
                  creator: address,
                  visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                  chargedReadQuota: '0',
                  spInfo: {
                    primarySpAddress: spInfo.primarySpAddress,
                  },
                  paymentAddress: address,
                },
                {
                  type: 'EDDSA',
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                  address,
                },
              );

              const simulateInfo = await createBucketTx.simulate({
                denom: 'BNB',
              });

              console.log('simulateInfo', simulateInfo);

              const res = await createBucketTx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateInfo?.gasLimit),
                gasPrice: simulateInfo?.gasPrice || '5000000000',
                payer: address,
                granter: '',
              });

              if (res.code === 0) {
                alert('success');
              }
            } catch (err) {
              console.log(typeof err)
              if (err instanceof Error) {
                alert(err.message);
              }
              if (err && typeof err ==='object') {
                alert(JSON.stringify(err))
              }
            }
            
          }}
          >
            Create Bucket
          </button>
          <br></br><br></br>
          <a href={"https://testnet.greenfieldscan.com/account/" + address} target="_blank">
          <button
            className="button is-primary"
          >
            Check your Buckets
          </button>
          {/* list buckets could be used here. */}
          </a>
          </center>
        </div>
      </div>

      {/* Raw File Uploader */}
      <div className='box'>
          
          <center>
          <p className="subtitle">
            Upload Raw File
          </p>
          </center>
          <br></br>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Bucket</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={createBucketInfo.bucketName}
                    placeholder="bucket name"
                    onChange={(e) => {
                      setCreateBucketInfo({ ...createBucketInfo, bucketName: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Raw </label>
            </div>
            
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <textarea
                    className="input"
                    style={{height: '500px', width: '500px'}}
                    value={createBucketInfo.bucketName}
                    placeholder="raw data"
                    onChange={(e) => {
                      setCreateBucketInfo({ ...createBucketInfo, bucketName: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
  
          <div className="field">
            <center>
            <button
              className="button is-primary"
              onClick={async () => {
              // get signature
              if (!address) return;
  
              const spInfo = await selectSp();
              console.log('spInfo', spInfo);
  
              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }
  
              try {
                const createBucketTx = await client.bucket.createBucket(
                  {
                    bucketName: createBucketInfo.bucketName,
                    creator: address,
                    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                    chargedReadQuota: '0',
                    spInfo: {
                      primarySpAddress: spInfo.primarySpAddress,
                    },
                    paymentAddress: address,
                  },
                  {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                  },
                );
  
                const simulateInfo = await createBucketTx.simulate({
                  denom: 'BNB',
                });
  
                console.log('simulateInfo', simulateInfo);
  
                const res = await createBucketTx.broadcast({
                  denom: 'BNB',
                  gasLimit: Number(simulateInfo?.gasLimit),
                  gasPrice: simulateInfo?.gasPrice || '5000000000',
                  payer: address,
                  granter: '',
                });
  
                if (res.code === 0) {
                  alert('success');
                }
              } catch (err) {
                console.log(typeof err)
                if (err instanceof Error) {
                  alert(err.message);
                }
                if (err && typeof err ==='object') {
                  alert(JSON.stringify(err))
                }
              }
              
            }}
            >
              Upload
            </button>
            </center>

            <hr></hr>
            <div>
      <>
        <h4>Create Object</h4>
        bucket name :
        <input
          value={createObjectInfo.bucketName}
          placeholder="bucket name"
          onChange={(e) => {
            setCreateObjectInfo({ ...createObjectInfo, bucketName: e.target.value });
          }}
        />
        <br />
        object name :
        <input
          value={createObjectInfo.objectName}
          placeholder="object name"
          onChange={(e) => {
            setCreateObjectInfo({ ...createObjectInfo, objectName: e.target.value });
          }}
        />
        <br />
        <input
          type="file"
          placeholder="select a file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <br />
        <button
          onClick={async () => {
            // get signature
            if (!address || !file) {
              alert('Please select a file or address');
              return;
            }
            if (!address) return;
            const spInfo = await selectSp();
            console.log('spInfo', spInfo);

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeysTest(address, provider);
            console.log("offchain_data:" + JSON.stringify(offChainData));
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }
            
            try {

              const fileBytes = await file.arrayBuffer();
              const hashResult = await (window as any).FileHandle.getCheckSums(
                new Uint8Array(fileBytes),
              );
              const { contentLength, expectCheckSums } = hashResult;
  
              console.log('offChainData', offChainData);
              console.log('hashResult', hashResult);
              
              const createObjectTx = await client.object.createObject(
                {
                  bucketName: createObjectInfo.bucketName,
                  objectName: createObjectInfo.objectName,
                  creator: address,
                  visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                  fileType: file.type,
                  redundancyType: 'REDUNDANCY_EC_TYPE',
                  contentLength,
                  expectCheckSums: JSON.parse(expectCheckSums),
                },
                {
                  type: 'EDDSA',
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                  address,
                  // type: 'ECDSA',
                  // privateKey: ACCOUNT_PRIVATEKEY,
                },
              );
  
              const simulateInfo = await createObjectTx.simulate({
                denom: 'BNB',
              });
  
              console.log('simulateInfo', simulateInfo);

              const res = await createObjectTx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateInfo?.gasLimit),
                gasPrice: simulateInfo?.gasPrice || '5000000000',
                payer: address,
                granter: '',
              });

              if (res.code === 0) {
                alert('success');
              }
            } catch (err) {
              console.log(typeof err)
              if (err instanceof Error) {
                alert(err.message);
              }
              if (err && typeof err ==='object') {
                alert(JSON.stringify(err))
              }
            }
          }}
        >
          1. create object tx
        </button>
        <br />
        <button
          onClick={async () => {
            // get signature
            if (!address) return;

            const spInfo = await selectSp();
            console.log('spInfo', spInfo);

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const uploadRes = await client.object.uploadObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                body: file,
                txnHash: txHash,
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );
            console.log('uploadRes', uploadRes);

            if (uploadRes.code === 0) {
              alert('success');
            }
          }}
        >
          2. upload
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const createFolderTx = await client.object.createFolder(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName + '/',
                creator: address,
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );

            const simulateInfo = await createFolderTx.simulate({
              denom: 'BNB',
            });

            console.log('simulateInfo', simulateInfo);

            const res = await createFolderTx.broadcast({
              denom: 'BNB',
              gasLimit: Number(simulateInfo?.gasLimit),
              gasPrice: simulateInfo?.gasPrice || '5000000000',
              payer: address,
              granter: '',
            });

            console.log('res', res);

            if (res.code === 0) {
              alert('success');
            }
          }}
        >
          create folder
        </button>
      </>
    </div>
          </div>
        </div>
    </>
  );
};
