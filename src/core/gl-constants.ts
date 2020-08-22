////////////////////////////////////////////////////////////////////////////////////////
// WebGL constants
////////////////////////////////////////////////////////////////////////////////////////
// extracted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
// It gets minified better to use the raw constants values instad of using webglContext.CONSTANT
// Those values are standard in all browsers.
////////////////////////////////////////////////////////////////////////////////////////

/** Clearing buffers: Passed to clear to clear the current depth buffer. */
export const GL_DEPTH_BUFFER_BIT = 0x00000100

/** Clearing buffers: Passed to clear to clear the current stencil buffer. */
export const GL_STENCIL_BUFFER_BIT = 0x00000400

/** Clearing buffers: Passed to clear to clear the current color buffer. */
export const GL_COLOR_BUFFER_BIT = 0x00004000

/** Rendering primitives: Passed to drawElements or drawArrays to draw single points. */
export const GL_POINTS = 0x0000

/** Rendering primitives: Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it. */
export const GL_LINES = 0x0001

/** Rendering primitives: Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment. */
export const GL_LINE_LOOP = 0x0002

/** Rendering primitives: Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last. */
export const GL_LINE_STRIP = 0x0003

/** Rendering primitives: Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle. */
export const GL_TRIANGLES = 0x0004

/** Rendering primitives: Passed to drawElements or drawArrays to draw a connected group of triangles. */
export const GL_TRIANGLE_STRIP = 0x0005

/** Rendering primitives: Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan. */
export const GL_TRIANGLE_FAN = 0x0006

/** Blending modes: Passed to blendFunc or blendFuncSeparate to turn off a component. */
export const GL_ZERO = 0

/** Blending modes: Passed to blendFunc or blendFuncSeparate to turn on a component. */
export const GL_ONE = 1

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color. */
export const GL_SRC_COLOR = 0x0300

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color. */
export const GL_ONE_MINUS_SRC_COLOR = 0x0301

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha. */
export const GL_SRC_ALPHA = 0x0302

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha. */
export const GL_ONE_MINUS_SRC_ALPHA = 0x0303

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha. */
export const GL_DST_ALPHA = 0x0304

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha. */
export const GL_ONE_MINUS_DST_ALPHA = 0x0305

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color. */
export const GL_DST_COLOR = 0x0306

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color. */
export const GL_ONE_MINUS_DST_COLOR = 0x0307

/** Blending modes: Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha. */
export const GL_SRC_ALPHA_SATURATE = 0x0308

/** Blending modes: Passed to blendFunc or blendFuncSeparate to specify a constant color blend function. */
export const GL_CONSTANT_COLOR = 0x8001

/** Blending modes: Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function. */
export const GL_ONE_MINUS_CONSTANT_COLOR = 0x8002

/** Blending modes: Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function. */
export const GL_CONSTANT_ALPHA = 0x8003

/** Blending modes: Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function. */
export const GL_ONE_MINUS_CONSTANT_ALPHA = 0x8004

/** Blending equations: Passed to blendEquation or blendEquationSeparate to set an addition blend function. */
export const GL_FUNC_ADD = 0x8006

/** Blending equations: Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination). */
export const GL_FUNC_SUBTRACT = 0x800a

/** Blending equations: Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source). */
export const GL_FUNC_REVERSE_SUBTRACT = 0x800b

/** Getting GL parameter information: Passed to getParameter to get the current RGB blend function. */
export const GL_BLEND_EQUATION = 0x8009

/** Getting GL parameter information: Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION */
export const GL_BLEND_EQUATION_RGB = 0x8009

/** Getting GL parameter information: Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION */
export const GL_BLEND_EQUATION_ALPHA = 0x883d

/** Getting GL parameter information: Passed to getParameter to get the current destination RGB blend function. */
export const GL_BLEND_DST_RGB = 0x80c8

/** Getting GL parameter information: Passed to getParameter to get the current destination RGB blend function. */
export const GL_BLEND_SRC_RGB = 0x80c9

/** Getting GL parameter information: Passed to getParameter to get the current destination alpha blend function. */
export const GL_BLEND_DST_ALPHA = 0x80ca

/** Getting GL parameter information: Passed to getParameter to get the current source alpha blend function. */
export const GL_BLEND_SRC_ALPHA = 0x80cb

/** Getting GL parameter information: Passed to getParameter to return a the current blend color. */
export const GL_BLEND_COLOR = 0x8005

/** Getting GL parameter information: Passed to getParameter to get the array buffer binding. */
export const GL_ARRAY_BUFFER_BINDING = 0x8894

/** Getting GL parameter information: Passed to getParameter to get the current element array buffer. */
export const GL_ELEMENT_ARRAY_BUFFER_BINDING = 0x8895

/** Getting GL parameter information: Passed to getParameter to get the current lineWidth (set by the lineWidth method). */
export const GL_LINE_WIDTH = 0x0b21

/** Getting GL parameter information: Passed to getParameter to get the current size of a point drawn with GL_POINTS */
export const GL_ALIASED_POINT_SIZE_RANGE = 0x846d

/** Getting GL parameter information: Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1. */
export const GL_ALIASED_LINE_WIDTH_RANGE = 0x846e

/** Getting GL parameter information: Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK */
export const GL_CULL_FACE_MODE = 0x0b45

/** Getting GL parameter information: Passed to getParameter to determine the current value of frontFace. Should return CW or CCW. */
export const GL_FRONT_FACE = 0x0b46

/** Getting GL parameter information: Passed to getParameter to return a length-2 array of floats giving the current depth range. */
export const GL_DEPTH_RANGE = 0x0b70

/** Getting GL parameter information: Passed to getParameter to determine if the depth write mask is enabled. */
export const GL_DEPTH_WRITEMASK = 0x0b72

/** Getting GL parameter information: Passed to getParameter to determine the current depth clear value. */
export const GL_DEPTH_CLEAR_VALUE = 0x0b73

/** Getting GL parameter information: Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL. */
export const GL_DEPTH_FUNC = 0x0b74

/** Getting GL parameter information: Passed to getParameter to get the value the stencil will be cleared to. */
export const GL_STENCIL_CLEAR_VALUE = 0x0b91

/** Getting GL parameter information: Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL. */
export const GL_STENCIL_FUNC = 0x0b92

/** Getting GL parameter information: Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP. */
export const GL_STENCIL_FAIL = 0x0b94

/** Getting GL parameter information: Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP. */
export const GL_STENCIL_PASS_DEPTH_FAIL = 0x0b95

/** Getting GL parameter information: Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP. */
export const GL_STENCIL_PASS_DEPTH_PASS = 0x0b96

/** Getting GL parameter information: Passed to getParameter to get the reference value used for stencil tests. */
export const GL_STENCIL_REF = 0x0b97

/** Getting GL parameter information: */
export const GL_STENCIL_VALUE_MASK = 0x0b93

/** Getting GL parameter information: */
export const GL_STENCIL_WRITEMASK = 0x0b98

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_FUNC = 0x8800

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_FAIL = 0x8801

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_PASS_DEPTH_PASS = 0x8803

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_REF = 0x8ca3

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_VALUE_MASK = 0x8ca4

/** Getting GL parameter information: */
export const GL_STENCIL_BACK_WRITEMASK = 0x8ca5

/** Getting GL parameter information: Returns an Int32Array with four elements for the current viewport dimensions. */
export const GL_VIEWPORT = 0x0ba2

/** Getting GL parameter information: Returns an Int32Array with four elements for the current scissor box dimensions. */
export const GL_SCISSOR_BOX = 0x0c10

/** Getting GL parameter information: */
export const GL_COLOR_CLEAR_VALUE = 0x0c22

/** Getting GL parameter information: */
export const GL_COLOR_WRITEMASK = 0x0c23

/** Getting GL parameter information: */
export const GL_UNPACK_ALIGNMENT = 0x0cf5

/** Getting GL parameter information: */
export const GL_PACK_ALIGNMENT = 0x0d05

/** Getting GL parameter information: */
export const GL_MAX_TEXTURE_SIZE = 0x0d33

/** Getting GL parameter information: */
export const GL_MAX_VIEWPORT_DIMS = 0x0d3a

/** Getting GL parameter information: */
export const GL_SUBPIXEL_BITS = 0x0d50

/** Getting GL parameter information: */
export const GL_RED_BITS = 0x0d52

/** Getting GL parameter information: */
export const GL_GREEN_BITS = 0x0d53

/** Getting GL parameter information: */
export const GL_BLUE_BITS = 0x0d54

/** Getting GL parameter information: */
export const GL_ALPHA_BITS = 0x0d55

/** Getting GL parameter information: */
export const GL_DEPTH_BITS = 0x0d56

/** Getting GL parameter information: */
export const GL_STENCIL_BITS = 0x0d57

/** Getting GL parameter information: */
export const GL_POLYGON_OFFSET_UNITS = 0x2a00

/** Getting GL parameter information: */
export const GL_POLYGON_OFFSET_FACTOR = 0x8038

/** Getting GL parameter information: */
export const GL_TEXTURE_BINDING_2D = 0x8069

/** Getting GL parameter information: */
export const GL_SAMPLE_BUFFERS = 0x80a8

/** Getting GL parameter information: */
export const GL_SAMPLES = 0x80a9

/** Getting GL parameter information: */
export const GL_SAMPLE_COVERAGE_VALUE = 0x80aa

/** Getting GL parameter information: */
export const GL_SAMPLE_COVERAGE_INVERT = 0x80ab

/** Getting GL parameter information: */
export const GL_COMPRESSED_TEXTURE_FORMATS = 0x86a3

/** Getting GL parameter information: */
export const GL_VENDOR = 0x1f00

/** Getting GL parameter information: */
export const GL_RENDERER = 0x1f01

/** Getting GL parameter information: */
export const GL_VERSION = 0x1f02

/** Getting GL parameter information: */
export const GL_IMPLEMENTATION_COLOR_READ_TYPE = 0x8b9a

/** Getting GL parameter information: */
export const GL_IMPLEMENTATION_COLOR_READ_FORMAT = 0x8b9b

/** Getting GL parameter information: */
export const GL_BROWSER_DEFAULT_WEBGL = 0x9244

/** Buffers: Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often. */
export const GL_STATIC_DRAW = 0x88e4

/** Buffers: Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often. */
export const GL_STREAM_DRAW = 0x88e0

/** Buffers: Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often. */
export const GL_DYNAMIC_DRAW = 0x88e8

/** Buffers: Passed to bindBuffer or bufferData to specify the type of buffer being used. */
export const GL_ARRAY_BUFFER = 0x8892

/** Buffers: Passed to bindBuffer or bufferData to specify the type of buffer being used. */
export const GL_ELEMENT_ARRAY_BUFFER = 0x8893

/** Buffers: Passed to getBufferParameter to get a buffer's size. */
export const GL_BUFFER_SIZE = 0x8764

/** Buffers: Passed to getBufferParameter to get the hint for the buffer passed in when it was created. */
export const GL_BUFFER_USAGE = 0x8765

/** Vertex attributes: Passed to getVertexAttrib to read back the current vertex attribute. */
export const GL_CURRENT_VERTEX_ATTRIB = 0x8626

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_SIZE = 0x8623

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_TYPE = 0x8625

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886a

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_POINTER = 0x8645

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889f

/** Culling: Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method. */
export const GL_CULL_FACE = 0x0b44

/** Culling: Passed to cullFace to specify that only front faces should be culled. */
export const GL_FRONT = 0x0404

/** Culling: Passed to cullFace to specify that only back faces should be culled. */
export const GL_BACK = 0x0405

/** Culling: Passed to cullFace to specify that front and back faces should be culled. */
export const GL_FRONT_AND_BACK = 0x0408

/** Enabling and disabling: Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method. */
export const GL_BLEND = 0x0be2

/** Enabling and disabling: Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test. */
export const GL_DEPTH_TEST = 0x0b71

/** Enabling and disabling: Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method. */
export const GL_DITHER = 0x0bd0

/** Enabling and disabling: Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test. */
export const GL_POLYGON_OFFSET_FILL = 0x8037

/** Enabling and disabling: Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels. */
export const GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809e

/** Enabling and disabling: Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling. */
export const GL_SAMPLE_COVERAGE = 0x80a0

/** Enabling and disabling: Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test. */
export const GL_SCISSOR_TEST = 0x0c11

/** Enabling and disabling: Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test. */
export const GL_STENCIL_TEST = 0x0b90

/** Errors: Returned from getError. */
export const GL_NO_ERROR = 0

/** Errors: Returned from getError. */
export const GL_INVALID_ENUM = 0x0500

/** Errors: Returned from getError. */
export const GL_INVALID_VALUE = 0x0501

/** Errors: Returned from getError. */
export const GL_INVALID_OPERATION = 0x0502

/** Errors: Returned from getError. */
export const GL_OUT_OF_MEMORY = 0x0505

/** Errors: Returned from getError. */
export const GL_CONTEXT_LOST_WEBGL = 0x9242

/** Front face directions: Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction */
export const GL_CW = 0x0900

/** Front face directions: Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction */
export const GL_CCW = 0x0901

/** Hints: There is no preference for this behavior. */
export const GL_DONT_CARE = 0x1100

/** Hints: The most efficient behavior should be used. */
export const GL_FASTEST = 0x1101

/** Hints: The most correct or the highest quality option should be used. */
export const GL_NICEST = 0x1102

/** Hints: Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap(). */
export const GL_GENERATE_MIPMAP_HINT = 0x8192

/** Data types: */
export const GL_BYTE = 0x1400

/** Data types and Pixel types: */
export const GL_UNSIGNED_BYTE = 0x1401

/** Data types: */
export const GL_SHORT = 0x1402

/** Data types: */
export const GL_UNSIGNED_SHORT = 0x1403

/** Data types: */
export const GL_INT = 0x1404

/** Data types: */
export const GL_UNSIGNED_INT = 0x1405

/** Data types: */
export const GL_FLOAT = 0x1406

/** Pixel formats: */
export const GL_DEPTH_COMPONENT = 0x1902

/** Pixel formats: */
export const GL_ALPHA = 0x1906

/** Pixel formats: */
export const GL_RGB = 0x1907

/** Pixel formats: */
export const GL_RGBA = 0x1908

/** Pixel formats: */
export const GL_LUMINANCE = 0x1909

/** Pixel formats: */
export const GL_LUMINANCE_ALPHA = 0x190a

/** Pixel types: */
export const GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033

/** Pixel types: */
export const GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034

/** Pixel types: */
export const GL_UNSIGNED_SHORT_5_6_5 = 0x8363

/** Shaders: Passed to createShader to define a fragment shader. */
export const GL_FRAGMENT_SHADER = 0x8b30

/** Shaders: Passed to createShader to define a vertex shader */
export const GL_VERTEX_SHADER = 0x8b31

/** Shaders: Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error */
export const GL_COMPILE_STATUS = 0x8b81

/** Shaders: Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise. */
export const GL_DELETE_STATUS = 0x8b80

/** Shaders: Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error. */
export const GL_LINK_STATUS = 0x8b82

/** Shaders: Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found. */
export const GL_VALIDATE_STATUS = 0x8b83

/** Shaders: Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred. */
export const GL_ATTACHED_SHADERS = 0x8b85

/** Shaders: Passed to getProgramParameter to get the number of attributes active in a program. */
export const GL_ACTIVE_ATTRIBUTES = 0x8b89

/** Shaders: Passed to getProgramParamter to get the number of uniforms active in a program. */
export const GL_ACTIVE_UNIFORMS = 0x8b86

/** Shaders: The maximum number of entries possible in the vertex attribute list. */
export const GL_MAX_VERTEX_ATTRIBS = 0x8869

/** Shaders: */
export const GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8dfb

/** Shaders: */
export const GL_MAX_VARYING_VECTORS = 0x8dfc

/** Shaders: */
export const GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d

/** Shaders: */
export const GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8b4c

/** Shaders: Implementation dependent number of maximum texture units. At least 8. */
export const GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872

/** Shaders: */
export const GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8dfd

/** Shaders: */
export const GL_SHADER_TYPE = 0x8b4f

/** Shaders: */
export const GL_SHADING_LANGUAGE_VERSION = 0x8b8c

/** Shaders: */
export const GL_CURRENT_PROGRAM = 0x8b8d

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn. */
export const GL_NEVER = 0x0200

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value. */
export const GL_LESS = 0x0201

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value. */
export const GL_EQUAL = 0x0202

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value. */
export const GL_LEQUAL = 0x0203

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value. */
export const GL_GREATER = 0x0204

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value. */
export const GL_NOTEQUAL = 0x0205

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value. */
export const GL_GEQUAL = 0x0206

/** Depth or stencil tests: Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn. */
export const GL_ALWAYS = 0x0207

/** Stencil actions: */
export const GL_KEEP = 0x1e00

/** Stencil actions: */
export const GL_REPLACE = 0x1e01

/** Stencil actions: */
export const GL_INCR = 0x1e02

/** Stencil actions: */
export const GL_DECR = 0x1e03

/** Stencil actions: */
export const GL_INVERT = 0x150a

/** Stencil actions: */
export const GL_INCR_WRAP = 0x8507

/** Stencil actions: */
export const GL_DECR_WRAP = 0x8508

/** Textures: */
export const GL_NEAREST = 0x2600

/** Textures: */
export const GL_LINEAR = 0x2601

/** Textures: */
export const GL_NEAREST_MIPMAP_NEAREST = 0x2700

/** Textures: */
export const GL_LINEAR_MIPMAP_NEAREST = 0x2701

/** Textures: */
export const GL_NEAREST_MIPMAP_LINEAR = 0x2702

/** Textures: */
export const GL_LINEAR_MIPMAP_LINEAR = 0x2703

/** Textures: */
export const GL_TEXTURE_MAG_FILTER = 0x2800

/** Textures: */
export const GL_TEXTURE_MIN_FILTER = 0x2801

/** Textures: */
export const GL_TEXTURE_WRAP_S = 0x2802

/** Textures: */
export const GL_TEXTURE_WRAP_T = 0x2803

/** Textures: */
export const GL_TEXTURE_2D = 0x0de1

/** Textures: */
export const GL_TEXTURE = 0x1702

/** Textures: */
export const GL_TEXTURE_CUBE_MAP = 0x8513

/** Textures: */
export const GL_TEXTURE_BINDING_CUBE_MAP = 0x8514

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519

/** Textures: */
export const GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a

/** Textures: */
export const GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851c

/** Textures: A texture unit. */
export const GL_TEXTURE0 = 0x84c0

/** Textures: A texture unit. */
export const GL_TEXTURE1 = 0x84c1

/** Textures: A texture unit. */
export const GL_TEXTURE2 = 0x84c2

/** Textures: A texture unit. */
export const GL_TEXTURE3 = 0x84c3

/** Textures: A texture unit. */
export const GL_TEXTURE4 = 0x84c4

/** Textures: A texture unit. */
export const GL_TEXTURE5 = 0x84c5

/** Textures: A texture unit. */
export const GL_TEXTURE6 = 0x84c6

/** Textures: A texture unit. */
export const GL_TEXTURE7 = 0x84c7

/** Textures: A texture unit. */
export const GL_TEXTURE8 = 0x84c8

/** Textures: A texture unit. */
export const GL_TEXTURE9 = 0x84c9

/** Textures: A texture unit. */
export const GL_TEXTURE10 = 0x84ca

/** Textures: A texture unit. */
export const GL_TEXTURE11 = 0x84cb

/** Textures: A texture unit. */
export const GL_TEXTURE12 = 0x84cc

/** Textures: A texture unit. */
export const GL_TEXTURE13 = 0x84cd

/** Textures: A texture unit. */
export const GL_TEXTURE14 = 0x84ce

/** Textures: A texture unit. */
export const GL_TEXTURE15 = 0x84cf

/** Textures: A texture unit. */
export const GL_TEXTURE16 = 0x84d0

/** Textures: A texture unit. */
export const GL_TEXTURE17 = 0x84d1

/** Textures: A texture unit. */
export const GL_TEXTURE18 = 0x84d2

/** Textures: A texture unit. */
export const GL_TEXTURE19 = 0x84d3

/** Textures: A texture unit. */
export const GL_TEXTURE20 = 0x84d4

/** Textures: A texture unit. */
export const GL_TEXTURE21 = 0x84d5

/** Textures: A texture unit. */
export const GL_TEXTURE22 = 0x84d6

/** Textures: A texture unit. */
export const GL_TEXTURE23 = 0x84d7

/** Textures: A texture unit. */
export const GL_TEXTURE24 = 0x84d8

/** Textures: A texture unit. */
export const GL_TEXTURE25 = 0x84d9

/** Textures: A texture unit. */
export const GL_TEXTURE26 = 0x84da

/** Textures: A texture unit. */
export const GL_TEXTURE27 = 0x84db

/** Textures: A texture unit. */
export const GL_TEXTURE28 = 0x84dc

/** Textures: A texture unit. */
export const GL_TEXTURE29 = 0x84dd

/** Textures: A texture unit. */
export const GL_TEXTURE30 = 0x84de

/** Textures: A texture unit. */
export const GL_TEXTURE31 = 0x84df

/** Textures: The current active texture unit. */
export const GL_ACTIVE_TEXTURE = 0x84e0

/** Textures: */
export const GL_REPEAT = 0x2901

/** Textures: */
export const GL_CLAMP_TO_EDGE = 0x812f

/** Textures: */
export const GL_MIRRORED_REPEAT = 0x8370

/** Uniform types: */
export const GL_FLOAT_VEC2 = 0x8b50

/** Uniform types: */
export const GL_FLOAT_VEC3 = 0x8b51

/** Uniform types: */
export const GL_FLOAT_VEC4 = 0x8b52

/** Uniform types: */
export const GL_INT_VEC2 = 0x8b53

/** Uniform types: */
export const GL_INT_VEC3 = 0x8b54

/** Uniform types: */
export const GL_INT_VEC4 = 0x8b55

/** Uniform types: */
export const GL_BOOL = 0x8b56

/** Uniform types: */
export const GL_BOOL_VEC2 = 0x8b57

/** Uniform types: */
export const GL_BOOL_VEC3 = 0x8b58

/** Uniform types: */
export const GL_BOOL_VEC4 = 0x8b59

/** Uniform types: */
export const GL_FLOAT_MAT2 = 0x8b5a

/** Uniform types: */
export const GL_FLOAT_MAT3 = 0x8b5b

/** Uniform types: */
export const GL_FLOAT_MAT4 = 0x8b5c

/** Uniform types: */
export const GL_SAMPLER_2D = 0x8b5e

/** Uniform types: */
export const GL_SAMPLER_CUBE = 0x8b60

/** Shader precision-specified types: */
export const GL_LOW_FLOAT = 0x8df0

/** Shader precision-specified types: */
export const GL_MEDIUM_FLOAT = 0x8df1

/** Shader precision-specified types: */
export const GL_HIGH_FLOAT = 0x8df2

/** Shader precision-specified types: */
export const GL_LOW_INT = 0x8df3

/** Shader precision-specified types: */
export const GL_MEDIUM_INT = 0x8df4

/** Shader precision-specified types: */
export const GL_HIGH_INT = 0x8df5

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER = 0x8d40

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER = 0x8d41

/** Framebuffers and renderbuffers: */
export const GL_RGBA4 = 0x8056

/** Framebuffers and renderbuffers: */
export const GL_RGB5_A1 = 0x8057

/** Framebuffers and renderbuffers: */
export const GL_RGB565 = 0x8d62

/** Framebuffers and renderbuffers: */
export const GL_DEPTH_COMPONENT16 = 0x81a5

/** Framebuffers and renderbuffers: */
export const GL_STENCIL_INDEX8 = 0x8d48

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_WIDTH = 0x8d42

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_HEIGHT = 0x8d43

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_INTERNAL_FORMAT = 0x8d44

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_RED_SIZE = 0x8d50

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_GREEN_SIZE = 0x8d51

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_BLUE_SIZE = 0x8d52

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_ALPHA_SIZE = 0x8d53

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_DEPTH_SIZE = 0x8d54

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_STENCIL_SIZE = 0x8d55

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8cd0

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8cd1

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8cd2

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8cd3

/** Framebuffers and renderbuffers: */
export const GL_COLOR_ATTACHMENT0 = 0x8ce0

/** Framebuffers and renderbuffers: */
export const GL_DEPTH_ATTACHMENT = 0x8d00

/** Framebuffers and renderbuffers: */
export const GL_STENCIL_ATTACHMENT = 0x8d20

/** Framebuffers and renderbuffers: */
export const GL_NONE = 0

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_COMPLETE = 0x8cd5

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8cd6

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8cd7

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8cd9

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_UNSUPPORTED = 0x8cdd

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_BINDING = 0x8ca6

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_BINDING = 0x8ca7

/** Framebuffers and renderbuffers: */
export const GL_MAX_RENDERBUFFER_SIZE = 0x84e8

/** Framebuffers and renderbuffers: */
export const GL_INVALID_FRAMEBUFFER_OPERATION = 0x0506

/** Pixel storage modes: */
export const GL_UNPACK_FLIP_Y_WEBGL = 0x9240

/** Pixel storage modes: */
export const GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241

/** Pixel storage modes: */
export const GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243

/** Getting GL parameter information: */
export const GL_READ_BUFFER = 0x0c02

/** Getting GL parameter information: */
export const GL_UNPACK_ROW_LENGTH = 0x0cf2

/** Getting GL parameter information: */
export const GL_UNPACK_SKIP_ROWS = 0x0cf3

/** Getting GL parameter information: */
export const GL_UNPACK_SKIP_PIXELS = 0x0cf4

/** Getting GL parameter information: */
export const GL_PACK_ROW_LENGTH = 0x0d02

/** Getting GL parameter information: */
export const GL_PACK_SKIP_ROWS = 0x0d03

/** Getting GL parameter information: */
export const GL_PACK_SKIP_PIXELS = 0x0d04

/** Getting GL parameter information: */
export const GL_TEXTURE_BINDING_3D = 0x806a

/** Getting GL parameter information: */
export const GL_UNPACK_SKIP_IMAGES = 0x806d

/** Getting GL parameter information: */
export const GL_UNPACK_IMAGE_HEIGHT = 0x806e

/** Getting GL parameter information: */
export const GL_MAX_3D_TEXTURE_SIZE = 0x8073

/** Getting GL parameter information: */
export const GL_MAX_ELEMENTS_VERTICES = 0x80e8

/** Getting GL parameter information: */
export const GL_MAX_ELEMENTS_INDICES = 0x80e9

/** Getting GL parameter information: */
export const GL_MAX_TEXTURE_LOD_BIAS = 0x84fd

/** Getting GL parameter information: */
export const GL_MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8b49

/** Getting GL parameter information: */
export const GL_MAX_VERTEX_UNIFORM_COMPONENTS = 0x8b4a

/** Getting GL parameter information: */
export const GL_MAX_ARRAY_TEXTURE_LAYERS = 0x88ff

/** Getting GL parameter information: */
export const GL_MIN_PROGRAM_TEXEL_OFFSET = 0x8904

/** Getting GL parameter information: */
export const GL_MAX_PROGRAM_TEXEL_OFFSET = 0x8905

/** Getting GL parameter information: */
export const GL_MAX_VARYING_COMPONENTS = 0x8b4b

/** Getting GL parameter information: */
export const GL_FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8b8b

/** Getting GL parameter information: */
export const GL_RASTERIZER_DISCARD = 0x8c89

/** Getting GL parameter information: */
export const GL_VERTEX_ARRAY_BINDING = 0x85b5

/** Getting GL parameter information: */
export const GL_MAX_VERTEX_OUTPUT_COMPONENTS = 0x9122

/** Getting GL parameter information: */
export const GL_MAX_FRAGMENT_INPUT_COMPONENTS = 0x9125

/** Getting GL parameter information: */
export const GL_MAX_SERVER_WAIT_TIMEOUT = 0x9111

/** Getting GL parameter information: */
export const GL_MAX_ELEMENT_INDEX = 0x8d6b

/** Textures: */
export const GL_RED = 0x1903

/** Textures: */
export const GL_RGB8 = 0x8051

/** Textures: */
export const GL_RGBA8 = 0x8058

/** Textures: */
export const GL_RGB10_A2 = 0x8059

/** Textures: */
export const GL_TEXTURE_3D = 0x806f

/** Textures: */
export const GL_TEXTURE_WRAP_R = 0x8072

/** Textures: */
export const GL_TEXTURE_MIN_LOD = 0x813a

/** Textures: */
export const GL_TEXTURE_MAX_LOD = 0x813b

/** Textures: */
export const GL_TEXTURE_BASE_LEVEL = 0x813c

/** Textures: */
export const GL_TEXTURE_MAX_LEVEL = 0x813d

/** Textures: */
export const GL_TEXTURE_COMPARE_MODE = 0x884c

/** Textures: */
export const GL_TEXTURE_COMPARE_FUNC = 0x884d

/** Textures: */
export const GL_SRGB = 0x8c40

/** Textures: */
export const GL_SRGB8 = 0x8c41

/** Textures: */
export const GL_SRGB8_ALPHA8 = 0x8c43

/** Textures: */
export const GL_COMPARE_REF_TO_TEXTURE = 0x884e

/** Textures: */
export const GL_RGBA32F = 0x8814

/** Textures: */
export const GL_RGB32F = 0x8815

/** Textures: */
export const GL_RGBA16F = 0x881a

/** Textures: */
export const GL_RGB16F = 0x881b

/** Textures: */
export const GL_TEXTURE_2D_ARRAY = 0x8c1a

/** Textures: */
export const GL_TEXTURE_BINDING_2D_ARRAY = 0x8c1d

/** Textures: */
export const GL_R11F_G11F_B10F = 0x8c3a

/** Textures: */
export const GL_RGB9_E5 = 0x8c3d

/** Textures: */
export const GL_RGBA32UI = 0x8d70

/** Textures: */
export const GL_RGB32UI = 0x8d71

/** Textures: */
export const GL_RGBA16UI = 0x8d76

/** Textures: */
export const GL_RGB16UI = 0x8d77

/** Textures: */
export const GL_RGBA8UI = 0x8d7c

/** Textures: */
export const GL_RGB8UI = 0x8d7d

/** Textures: */
export const GL_RGBA32I = 0x8d82

/** Textures: */
export const GL_RGB32I = 0x8d83

/** Textures: */
export const GL_RGBA16I = 0x8d88

/** Textures: */
export const GL_RGB16I = 0x8d89

/** Textures: */
export const GL_RGBA8I = 0x8d8e

/** Textures: */
export const GL_RGB8I = 0x8d8f

/** Textures: */
export const GL_RED_INTEGER = 0x8d94

/** Textures: */
export const GL_RGB_INTEGER = 0x8d98

/** Textures: */
export const GL_RGBA_INTEGER = 0x8d99

/** Textures: */
export const GL_R8 = 0x8229

/** Textures: */
export const GL_RG8 = 0x822b

/** Textures: */
export const GL_R16F = 0x822d

/** Textures: */
export const GL_R32F = 0x822e

/** Textures: */
export const GL_RG16F = 0x822f

/** Textures: */
export const GL_RG32F = 0x8230

/** Textures: */
export const GL_R8I = 0x8231

/** Textures: */
export const GL_R8UI = 0x8232

/** Textures: */
export const GL_R16I = 0x8233

/** Textures: */
export const GL_R16UI = 0x8234

/** Textures: */
export const GL_R32I = 0x8235

/** Textures: */
export const GL_R32UI = 0x8236

/** Textures: */
export const GL_RG8I = 0x8237

/** Textures: */
export const GL_RG8UI = 0x8238

/** Textures: */
export const GL_RG16I = 0x8239

/** Textures: */
export const GL_RG16UI = 0x823a

/** Textures: */
export const GL_RG32I = 0x823b

/** Textures: */
export const GL_RG32UI = 0x823c

/** Textures: */
export const GL_R8_SNORM = 0x8f94

/** Textures: */
export const GL_RG8_SNORM = 0x8f95

/** Textures: */
export const GL_RGB8_SNORM = 0x8f96

/** Textures: */
export const GL_RGBA8_SNORM = 0x8f97

/** Textures: */
export const GL_RGB10_A2UI = 0x906f

/** Textures: */
export const GL_TEXTURE_IMMUTABLE_FORMAT = 0x912f

/** Textures: */
export const GL_TEXTURE_IMMUTABLE_LEVELS = 0x82df

/** Pixel types: */
export const GL_UNSIGNED_INT_2_10_10_10_REV = 0x8368

/** Pixel types: */
export const GL_UNSIGNED_INT_10F_11F_11F_REV = 0x8c3b

/** Pixel types: */
export const GL_UNSIGNED_INT_5_9_9_9_REV = 0x8c3e

/** Pixel types: */
export const GL_FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8dad

/** Pixel types: */
export const GL_UNSIGNED_INT_24_8 = 0x84fa

/** Pixel types: */
export const GL_HALF_FLOAT = 0x140b

/** Pixel types: */
export const GL_RG = 0x8227

/** Pixel types: */
export const GL_RG_INTEGER = 0x8228

/** Pixel types: */
export const GL_INT_2_10_10_10_REV = 0x8d9f

/** Queries: */
export const GL_CURRENT_QUERY = 0x8865

/** Queries: */
export const GL_QUERY_RESULT = 0x8866

/** Queries: */
export const GL_QUERY_RESULT_AVAILABLE = 0x8867

/** Queries: */
export const GL_ANY_SAMPLES_PASSED = 0x8c2f

/** Queries: */
export const GL_ANY_SAMPLES_PASSED_CONSERVATIVE = 0x8d6a

/** Draw buffers: */
export const GL_MAX_DRAW_BUFFERS = 0x8824

/** Draw buffers: */
export const GL_DRAW_BUFFER0 = 0x8825

/** Draw buffers: */
export const GL_DRAW_BUFFER1 = 0x8826

/** Draw buffers: */
export const GL_DRAW_BUFFER2 = 0x8827

/** Draw buffers: */
export const GL_DRAW_BUFFER3 = 0x8828

/** Draw buffers: */
export const GL_DRAW_BUFFER4 = 0x8829

/** Draw buffers: */
export const GL_DRAW_BUFFER5 = 0x882a

/** Draw buffers: */
export const GL_DRAW_BUFFER6 = 0x882b

/** Draw buffers: */
export const GL_DRAW_BUFFER7 = 0x882c

/** Draw buffers: */
export const GL_DRAW_BUFFER8 = 0x882d

/** Draw buffers: */
export const GL_DRAW_BUFFER9 = 0x882e

/** Draw buffers: */
export const GL_DRAW_BUFFER10 = 0x882f

/** Draw buffers: */
export const GL_DRAW_BUFFER11 = 0x8830

/** Draw buffers: */
export const GL_DRAW_BUFFER12 = 0x8831

/** Draw buffers: */
export const GL_DRAW_BUFFER13 = 0x8832

/** Draw buffers: */
export const GL_DRAW_BUFFER14 = 0x8833

/** Draw buffers: */
export const GL_DRAW_BUFFER15 = 0x8834

/** Draw buffers: */
export const GL_MAX_COLOR_ATTACHMENTS = 0x8cdf

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT1 = 0x8ce1

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT2 = 0x8ce2

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT3 = 0x8ce3

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT4 = 0x8ce4

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT5 = 0x8ce5

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT6 = 0x8ce6

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT7 = 0x8ce7

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT8 = 0x8ce8

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT9 = 0x8ce9

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT10 = 0x8cea

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT11 = 0x8ceb

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT12 = 0x8cec

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT13 = 0x8ced

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT14 = 0x8cee

/** Draw buffers: */
export const GL_COLOR_ATTACHMENT15 = 0x8cef

/** Samplers: */
export const GL_SAMPLER_3D = 0x8b5f

/** Samplers: */
export const GL_SAMPLER_2D_SHADOW = 0x8b62

/** Samplers: */
export const GL_SAMPLER_2D_ARRAY = 0x8dc1

/** Samplers: */
export const GL_SAMPLER_2D_ARRAY_SHADOW = 0x8dc4

/** Samplers: */
export const GL_SAMPLER_CUBE_SHADOW = 0x8dc5

/** Samplers: */
export const GL_INT_SAMPLER_2D = 0x8dca

/** Samplers: */
export const GL_INT_SAMPLER_3D = 0x8dcb

/** Samplers: */
export const GL_INT_SAMPLER_CUBE = 0x8dcc

/** Samplers: */
export const GL_INT_SAMPLER_2D_ARRAY = 0x8dcf

/** Samplers: */
export const GL_UNSIGNED_INT_SAMPLER_2D = 0x8dd2

/** Samplers: */
export const GL_UNSIGNED_INT_SAMPLER_3D = 0x8dd3

/** Samplers: */
export const GL_UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4

/** Samplers: */
export const GL_UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7

/** Samplers: */
export const GL_MAX_SAMPLES = 0x8d57

/** Samplers: */
export const GL_SAMPLER_BINDING = 0x8919

/** Buffers: */
export const GL_PIXEL_PACK_BUFFER = 0x88eb

/** Buffers: */
export const GL_PIXEL_UNPACK_BUFFER = 0x88ec

/** Buffers: */
export const GL_PIXEL_PACK_BUFFER_BINDING = 0x88ed

/** Buffers: */
export const GL_PIXEL_UNPACK_BUFFER_BINDING = 0x88ef

/** Buffers: */
export const GL_COPY_READ_BUFFER = 0x8f36

/** Buffers: */
export const GL_COPY_WRITE_BUFFER = 0x8f37

/** Buffers: */
export const GL_COPY_READ_BUFFER_BINDING = 0x8f36

/** Buffers: */
export const GL_COPY_WRITE_BUFFER_BINDING = 0x8f37

/** Data types: */
export const GL_FLOAT_MAT2x3 = 0x8b65

/** Data types: */
export const GL_FLOAT_MAT2x4 = 0x8b66

/** Data types: */
export const GL_FLOAT_MAT3x2 = 0x8b67

/** Data types: */
export const GL_FLOAT_MAT3x4 = 0x8b68

/** Data types: */
export const GL_FLOAT_MAT4x2 = 0x8b69

/** Data types: */
export const GL_FLOAT_MAT4x3 = 0x8b6a

/** Data types: */
export const GL_UNSIGNED_INT_VEC2 = 0x8dc6

/** Data types: */
export const GL_UNSIGNED_INT_VEC3 = 0x8dc7

/** Data types: */
export const GL_UNSIGNED_INT_VEC4 = 0x8dc8

/** Data types: */
export const GL_UNSIGNED_NORMALIZED = 0x8c17

/** Data types: */
export const GL_SIGNED_NORMALIZED = 0x8f9c

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_INTEGER = 0x88fd

/** Vertex attributes: */
export const GL_VERTEX_ATTRIB_ARRAY_DIVISOR = 0x88fe

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BUFFER_MODE = 0x8c7f

/** Transform feedback: */
export const GL_MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 0x8c80

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_VARYINGS = 0x8c83

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BUFFER_START = 0x8c84

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BUFFER_SIZE = 0x8c85

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 0x8c88

/** Transform feedback: */
export const GL_MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 0x8c8a

/** Transform feedback: */
export const GL_MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 0x8c8b

/** Transform feedback: */
export const GL_INTERLEAVED_ATTRIBS = 0x8c8c

/** Transform feedback: */
export const GL_SEPARATE_ATTRIBS = 0x8c8d

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BUFFER = 0x8c8e

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8c8f

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK = 0x8e22

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_PAUSED = 0x8e23

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_ACTIVE = 0x8e24

/** Transform feedback: */
export const GL_TRANSFORM_FEEDBACK_BINDING = 0x8e25

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 0x8210

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 0x8211

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_RED_SIZE = 0x8212

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 0x8213

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 0x8214

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 0x8215

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 0x8216

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 0x8217

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_DEFAULT = 0x8218

/** Framebuffers and renderbuffers: */
export const GL_DEPTH_STENCIL_ATTACHMENT = 0x821a

/** Framebuffers and renderbuffers: */
export const GL_DEPTH_STENCIL = 0x84f9

/** Framebuffers and renderbuffers: */
export const GL_DEPTH24_STENCIL8 = 0x88f0

/** Framebuffers and renderbuffers: */
export const GL_DRAW_FRAMEBUFFER_BINDING = 0x8ca6

/** Framebuffers and renderbuffers: */
export const GL_READ_FRAMEBUFFER = 0x8ca8

/** Framebuffers and renderbuffers: */
export const GL_DRAW_FRAMEBUFFER = 0x8ca9

/** Framebuffers and renderbuffers: */
export const GL_READ_FRAMEBUFFER_BINDING = 0x8caa

/** Framebuffers and renderbuffers: */
export const GL_RENDERBUFFER_SAMPLES = 0x8cab

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0x8cd4

/** Framebuffers and renderbuffers: */
export const GL_FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8d56

/** Uniforms: */
export const GL_UNIFORM_BUFFER = 0x8a11

/** Uniforms: */
export const GL_UNIFORM_BUFFER_BINDING = 0x8a28

/** Uniforms: */
export const GL_UNIFORM_BUFFER_START = 0x8a29

/** Uniforms: */
export const GL_UNIFORM_BUFFER_SIZE = 0x8a2a

/** Uniforms: */
export const GL_MAX_VERTEX_UNIFORM_BLOCKS = 0x8a2b

/** Uniforms: */
export const GL_MAX_FRAGMENT_UNIFORM_BLOCKS = 0x8a2d

/** Uniforms: */
export const GL_MAX_COMBINED_UNIFORM_BLOCKS = 0x8a2e

/** Uniforms: */
export const GL_MAX_UNIFORM_BUFFER_BINDINGS = 0x8a2f

/** Uniforms: */
export const GL_MAX_UNIFORM_BLOCK_SIZE = 0x8a30

/** Uniforms: */
export const GL_MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 0x8a31

/** Uniforms: */
export const GL_MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 0x8a33

/** Uniforms: */
export const GL_UNIFORM_BUFFER_OFFSET_ALIGNMENT = 0x8a34

/** Uniforms: */
export const GL_ACTIVE_UNIFORM_BLOCKS = 0x8a36

/** Uniforms: */
export const GL_UNIFORM_TYPE = 0x8a37

/** Uniforms: */
export const GL_UNIFORM_SIZE = 0x8a38

/** Uniforms: */
export const GL_UNIFORM_BLOCK_INDEX = 0x8a3a

/** Uniforms: */
export const GL_UNIFORM_OFFSET = 0x8a3b

/** Uniforms: */
export const GL_UNIFORM_ARRAY_STRIDE = 0x8a3c

/** Uniforms: */
export const GL_UNIFORM_MATRIX_STRIDE = 0x8a3d

/** Uniforms: */
export const GL_UNIFORM_IS_ROW_MAJOR = 0x8a3e

/** Uniforms: */
export const GL_UNIFORM_BLOCK_BINDING = 0x8a3f

/** Uniforms: */
export const GL_UNIFORM_BLOCK_DATA_SIZE = 0x8a40

/** Uniforms: */
export const GL_UNIFORM_BLOCK_ACTIVE_UNIFORMS = 0x8a42

/** Uniforms: */
export const GL_UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43

/** Uniforms: */
export const GL_UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44

/** Uniforms: */
export const GL_UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46

/** Sync objects: */
export const GL_OBJECT_TYPE = 0x9112

/** Sync objects: */
export const GL_SYNC_CONDITION = 0x9113

/** Sync objects: */
export const GL_SYNC_STATUS = 0x9114

/** Sync objects: */
export const GL_SYNC_FLAGS = 0x9115

/** Sync objects: */
export const GL_SYNC_FENCE = 0x9116

/** Sync objects: */
export const GL_SYNC_GPU_COMMANDS_COMPLETE = 0x9117

/** Sync objects: */
export const GL_UNSIGNALED = 0x9118

/** Sync objects: */
export const GL_SIGNALED = 0x9119

/** Sync objects: */
export const GL_ALREADY_SIGNALED = 0x911a

/** Sync objects: */
export const GL_TIMEOUT_EXPIRED = 0x911b

/** Sync objects: */
export const GL_CONDITION_SATISFIED = 0x911c

/** Sync objects: */
export const GL_WAIT_FAILED = 0x911d

/** Sync objects: */
export const GL_SYNC_FLUSH_COMMANDS_BIT = 0x00000001

/** Miscellaneous constants: */
export const GL_COLOR = 0x1800

/** Miscellaneous constants: */
export const GL_DEPTH = 0x1801

/** Miscellaneous constants: */
export const GL_STENCIL = 0x1802

/** Miscellaneous constants: */
export const GL_MIN = 0x8007

/** Miscellaneous constants: */
export const GL_MAX = 0x8008

/** Miscellaneous constants: */
export const GL_DEPTH_COMPONENT24 = 0x81a6

/** Miscellaneous constants: */
export const GL_STREAM_READ = 0x88e1

/** Miscellaneous constants: */
export const GL_STREAM_COPY = 0x88e2

/** Miscellaneous constants: */
export const GL_STATIC_READ = 0x88e5

/** Miscellaneous constants: */
export const GL_STATIC_COPY = 0x88e6

/** Miscellaneous constants: */
export const GL_DYNAMIC_READ = 0x88e9

/** Miscellaneous constants: */
export const GL_DYNAMIC_COPY = 0x88ea

/** Miscellaneous constants: */
export const GL_DEPTH_COMPONENT32F = 0x8cac

/** Miscellaneous constants: */
export const GL_DEPTH32F_STENCIL8 = 0x8cad

/** Miscellaneous constants: */
export const GL_INVALID_INDEX = 0xffffffff

/** Miscellaneous constants: */
export const GL_TIMEOUT_IGNORED = -1

/** Miscellaneous constants: */
export const GL_MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 0x9247

/** ANGLE_instanced_arrays: Describes the frequency divisor used for instanced rendering. */
export const GL_VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = 0x88fe

/** WEBGL_debug_renderer_info: Passed to getParameter to get the vendor string of the graphics driver. */
export const GL_UNMASKED_VENDOR_WEBGL = 0x9245

/** WEBGL_debug_renderer_info: Passed to getParameter to get the renderer string of the graphics driver. */
export const GL_UNMASKED_RENDERER_WEBGL = 0x9246

/** EXT_texture_filter_anisotropic: Returns the maximum available anisotropy. */
export const GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff

/** EXT_texture_filter_anisotropic: Passed to texParameter to set the desired maximum anisotropy for a texture. */
export const GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe

/** WEBGL_compressed_texture_s3tc: A DXT1-compressed image in an RGB image format. */
export const GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0

/** WEBGL_compressed_texture_s3tc: A DXT1-compressed image in an RGB image format with a simple on/off alpha value. */
export const GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1

/** WEBGL_compressed_texture_s3tc: A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression. */
export const GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83f2

/** WEBGL_compressed_texture_s3tc: A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done. */
export const GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83f3

/** WEBGL_compressed_texture_etc: One-channel (red) unsigned format compression. */
export const GL_COMPRESSED_R11_EAC = 0x9270

/** WEBGL_compressed_texture_etc: One-channel (red) signed format compression. */
export const GL_COMPRESSED_SIGNED_R11_EAC = 0x9271

/** WEBGL_compressed_texture_etc: Two-channel (red and green) unsigned format compression. */
export const GL_COMPRESSED_RG11_EAC = 0x9272

/** WEBGL_compressed_texture_etc: Two-channel (red and green) signed format compression. */
export const GL_COMPRESSED_SIGNED_RG11_EAC = 0x9273

/** WEBGL_compressed_texture_etc: Compresses RBG8 data with no alpha channel. */
export const GL_COMPRESSED_RGB8_ETC2 = 0x9274

/** WEBGL_compressed_texture_etc: Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately. */
export const GL_COMPRESSED_RGBA8_ETC2_EAC = 0x9275

/** WEBGL_compressed_texture_etc: Compresses sRBG8 data with no alpha channel. */
export const GL_COMPRESSED_SRGB8_ETC2 = 0x9276

/** WEBGL_compressed_texture_etc: Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately. */
export const GL_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277

/** WEBGL_compressed_texture_etc: Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent. */
export const GL_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278

/** WEBGL_compressed_texture_etc: Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent. */
export const GL_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279

/** WEBGL_compressed_texture_pvrtc: RGB compression in 4-bit mode. One block for each 4×4 pixels. */
export const GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00

/** WEBGL_compressed_texture_pvrtc: RGBA compression in 4-bit mode. One block for each 4×4 pixels. */
export const GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02

/** WEBGL_compressed_texture_pvrtc: RGB compression in 2-bit mode. One block for each 8×4 pixels. */
export const GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01

/** WEBGL_compressed_texture_pvrtc: RGBA compression in 2-bit mode. One block for each 8×4 pixe */
export const GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03

/** WEBGL_compressed_texture_etc1: Compresses 24-bit RGB data with no alpha channel. */
export const GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8d64

/** WEBGL_compressed_texture_atc: Compresses RGB textures with no alpha channel. */
export const GL_COMPRESSED_RGB_ATC_WEBGL = 0x8c92

/** WEBGL_compressed_texture_atc: Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp). */
export const GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8c92

/** WEBGL_compressed_texture_atc: Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient). */
export const GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87ee

/** WEBGL_depth_texture: Unsigned integer type for 24-bit depth texture data. */
export const GL_UNSIGNED_INT_24_8_WEBGL = 0x84fa

/** OES_texture_half_float: Half floating-point type (16-bit). */
export const GL_HALF_FLOAT_OES = 0x8d61

/** WEBGL_color_buffer_float: RGBA 32-bit floating-point color-renderable format. */
export const GL_RGBA32F_EXT = 0x8814

/** WEBGL_color_buffer_float: RGB 32-bit floating-point color-renderable format. */
export const GL_RGB32F_EXT = 0x8815

/** WEBGL_color_buffer_float: */
export const GL_FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211

/** WEBGL_color_buffer_float: */
export const GL_UNSIGNED_NORMALIZED_EXT = 0x8c17

/** EXT_blend_minmax: Produces the minimum color components of the source and destination colors. */
export const GL_MIN_EXT = 0x8007

/** EXT_blend_minmax: Produces the maximum color components of the source and destination colors. */
export const GL_MAX_EXT = 0x8008

/** EXT_sRGB: Unsized sRGB format that leaves the precision up to the driver. */
export const GL_SRGB_EXT = 0x8c40

/** EXT_sRGB: Unsized sRGB format with unsized alpha component. */
export const GL_SRGB_ALPHA_EXT = 0x8c42

/** EXT_sRGB: Sized (8-bit) sRGB and alpha formats. */
export const GL_SRGB8_ALPHA8_EXT = 0x8c43

/** EXT_sRGB: Returns the framebuffer color encoding. */
export const GL_FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 0x8210

/** OES_standard_derivatives: Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth. */
export const GL_FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8b8b

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT0_WEBGL = 0x8ce0

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT1_WEBGL = 0x8ce1

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT2_WEBGL = 0x8ce2

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT3_WEBGL = 0x8ce3

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT4_WEBGL = 0x8ce4

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT5_WEBGL = 0x8ce5

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT6_WEBGL = 0x8ce6

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT7_WEBGL = 0x8ce7

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT8_WEBGL = 0x8ce8

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT9_WEBGL = 0x8ce9

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT10_WEBGL = 0x8cea

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT11_WEBGL = 0x8ceb

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT12_WEBGL = 0x8cec

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT13_WEBGL = 0x8ced

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT14_WEBGL = 0x8cee

/** WEBGL_draw_buffers: Framebuffer color attachment point */
export const GL_COLOR_ATTACHMENT15_WEBGL = 0x8cef

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER0_WEBGL = 0x8825

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER1_WEBGL = 0x8826

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER2_WEBGL = 0x8827

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER3_WEBGL = 0x8828

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER4_WEBGL = 0x8829

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER5_WEBGL = 0x882a

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER6_WEBGL = 0x882b

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER7_WEBGL = 0x882c

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER8_WEBGL = 0x882d

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER9_WEBGL = 0x882e

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER10_WEBGL = 0x882f

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER11_WEBGL = 0x8830

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER12_WEBGL = 0x8831

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER13_WEBGL = 0x8832

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER14_WEBGL = 0x8833

/** WEBGL_draw_buffers: Draw buffer */
export const GL_DRAW_BUFFER15_WEBGL = 0x8834

/** WEBGL_draw_buffers: Maximum number of framebuffer color attachment points */
export const GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8cdf

/** WEBGL_draw_buffers: Maximum number of draw buffers */
export const GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824

/** OES_vertex_array_object: The bound vertex array object (VAO). */
export const GL_VERTEX_ARRAY_BINDING_OES = 0x85b5

/** EXT_disjoint_timer_query: The number of bits used to hold the query result for the given target. */
export const GL_QUERY_COUNTER_BITS_EXT = 0x8864

/** EXT_disjoint_timer_query: The currently active query. */
export const GL_CURRENT_QUERY_EXT = 0x8865

/** EXT_disjoint_timer_query: The query result. */
export const GL_QUERY_RESULT_EXT = 0x8866

/** EXT_disjoint_timer_query: A Boolean indicating whether or not a query result is available. */
export const GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867

/** EXT_disjoint_timer_query: Elapsed time (in nanoseconds). */
export const GL_TIME_ELAPSED_EXT = 0x88bf

/** EXT_disjoint_timer_query: The current time. */
export const GL_TIMESTAMP_EXT = 0x8e28

/** EXT_disjoint_timer_query: A Boolean indicating whether or not the GPU performed any disjoint operation. */
export const GL_GPU_DISJOINT_EXT = 0x8fbb
