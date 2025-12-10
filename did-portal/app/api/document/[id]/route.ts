import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const body = await request.json();
    
    console.log('📝 接收文档上传:', {
      documentId,
      timestamp: new Date().toISOString(),
      dataSize: JSON.stringify(body).length,
    });
    
    console.log('📄 文档内容:', body);
    
    // Here you would typically:
    // - Validate the document ID (DID format)
    // - Validate the JSON structure
    // - Store the document in a database or storage service
    // - Associate it with the DID
    // - Return the stored document info
    
    // Example: Forward to external backend service
    // const externalBackend = process.env.EXTERNAL_BACKEND_URL;
    // if (externalBackend) {
    //   const response = await fetch(`${externalBackend}/document/${documentId}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body),
    //   });
    //   return NextResponse.json(await response.json());
    // }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Document uploaded successfully',
        documentId,
        timestamp: new Date().toISOString(),
        size: JSON.stringify(body).length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ 文档上传失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to upload document',
      },
      { status: 500 }
    );
  }
}

// Handle GET to retrieve document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const documentId = params.id;
  
  console.log('📖 请求读取文档:', documentId);
  
  // Here you would typically retrieve the document from storage
  
  return NextResponse.json(
    {
      success: false,
      message: 'Document retrieval not implemented yet',
      documentId,
    },
    { status: 501 }
  );
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


